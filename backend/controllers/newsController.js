const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../models/categoryModel");
const newsModel = require("../models/newsModel");
const galleryModel = require("../models/galleryModel");
const {
	mongo: { ObjectId },
} = require("mongoose");
const slugify = require("slugify");

class newsController {
	add_news = async (req, res) => {
		const { id, name } = req.userInfo;
		const form = formidable({
			multiples: false,
			keepExtensions: true,
		});

		try {
			const [fields, files] = await form.parse(req);
			const contentLang = fields.contentLang?.[0];
			const categoryId = fields.categoryId?.[0];
			const title = fields.title?.[0]?.trim();
			const titleRegional = fields.titleRegional?.[0]?.trim();
			const description = fields.description?.[0] || "";
			const metaTitle = fields.metaTitle?.[0]?.trim() || "";
			const metaDescription = fields.metaDescription?.[0]?.trim() || "";
			const metaKeywords = JSON.parse(fields.metaKeywords?.[0]) || [];

			if (!contentLang || !["en", "hi", "od"].includes(contentLang)) {
				return res.status(400).json({ message: "Invalid language" });
			}
			if (contentLang !== "en" && !titleRegional) {
				return res.status(400).json({ message: "Regional title required" });
			}
			if (!categoryId) {
				return res.status(400).json({ message: "Category is required" });
			}

			if (!title) {
				return res.status(400).json({ message: "Title is required" });
			}

			if (contentLang !== "en" && titleRegional === "") {
				return res.status(400).json({ message: "Regional Title is required" });
			}

			const categoryExists = await categoryModel.findById(categoryId);
			if (!categoryExists) {
				return res.status(404).json({ message: "Category not found" });
			}

			let slug = slugify(title, { lower: true, strict: true });
			// Check duplicate slug per contentLang
			const slugExists = await newsModel.findOne({ slug, contentLang });
			if (slugExists) {
				slug = `${slug}-${Date.now()}`;
			}

			let imageUrl = "";
			if (files.image && files.image[0]) {
				cloudinary.config({
					cloud_name: process.env.cloudinary_cloud_name,
					api_key: process.env.cloudinary_api_key,
					api_secret: process.env.cloudinary_api_secret,
					secure: true,
				});
				const result = await cloudinary.uploader.upload(
					files.image[0].filepath,
					{ folder: "news_images" }
				);
				imageUrl = result.secure_url;
			}
			const news = await newsModel.create({
				contentLang,
				categoryId,
				writerId: id,
				writerName: name,
				title,
				titleRegional,
				slug,
				description,
				image: imageUrl || undefined,
				metaTitle,
				metaDescription,
				metaKeywords,
			});
			return res.status(201).json({ message: "News added successfully", news });
		} catch (error) {
			console.error("Add News Error:", error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	};
	get_images = async (req, res) => {
		const { id } = req.userInfo;
		try {
			const images = await galleryModel
				.find({ writerId: new ObjectId(id) })
				.sort({ createdAt: -1 });
			return res.status(200).json({ images });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	add_images = async (req, res) => {
		const { id } = req.userInfo;
		const form = formidable({});
		cloudinary.config({
			cloud_name: process.env.cloudinary_cloud_name,
			api_key: process.env.cloudinary_api_key,
			api_secret: process.env.cloudinary_api_secret,
			secure: true,
		});
		try {
			const [_, files] = await form.parse(req);
			let allImages = [];
			const { images } = files;
			for (let i = 0; i < images.length; i++) {
				const { url } = await cloudinary.uploader.upload(images[i].filepath, {
					folder: "news_images",
				});
				allImages.push({ writerId: id, url });
			}
			const newImages = await galleryModel.insertMany(allImages);
			return res
				.status(201)
				.json({ message: "Images uploaded successfully", images: newImages });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	get_all_news = async (req, res) => {
		const { id, role } = req.userInfo;

		// Query params
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const status = req.query.status;
		const contentLang = req.query.contentLang;
		const search = req.query.search;

		const skip = (page - 1) * limit;

		try {
			let filter = {};

			// Role-based filter
			if (role !== "admin") {
				filter.writerId = new ObjectId(id);
			}

			// Optional filters
			if (status) {
				filter.status = status;
			}

			if (contentLang) {
				filter.contentLang = contentLang;
			}
			if (search) {
				filter.$text = { $search: search };
			}
			const [news, total] = await Promise.all([
				newsModel
					.find(filter, search ? { score: { $meta: "textScore" } } : {})
					.populate("categoryId", "name nameRegional slug")
					.sort(
						search
							? { score: { $meta: "textScore" }, createdAt: -1 }
							: { createdAt: -1 }
					)
					.skip(skip)
					.limit(limit)
					.lean(),
				newsModel.countDocuments(filter),
			]);

			return res.status(200).json({
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				news,
			});
		} catch (error) {
			console.error("Get All News Error:", error);
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
	};
	get_edit_news = async (req, res) => {
		const { news_id } = req.params;
		const { id, role } = req.userInfo;

		if (!ObjectId.isValid(news_id)) {
			return res.status(400).json({ message: "Invalid news ID" });
		}
		try {
			const news = await newsModel.findById(news_id).lean();
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			// If not admin, allow only own news
			if (role !== "admin" && news.writerId.toString() !== id) {
				return res.status(403).json({ message: "Access denied" });
			}
			return res.status(200).json({ news });
		} catch (error) {
			console.error("Get Edit News Error:", error);
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
	};
	update_news = async (req, res) => {
		const { news_id } = req.params;

		if (!ObjectId.isValid(news_id)) {
			return res.status(400).json({ message: "Invalid news ID" });
		}

		const form = formidable({
			multiples: false,
			keepExtensions: true,
		});

		try {
			const [fields, files] = await form.parse(req);

			const contentLang = fields.contentLang?.[0];
			const categoryId = fields.categoryId?.[0];
			const title = fields.title?.[0]?.trim();
			const titleRegional = fields.titleRegional?.[0]?.trim();
			const description = fields.description?.[0] || "";
			const metaTitle = fields.metaTitle?.[0]?.trim() || "";
			const metaDescription = fields.metaDescription?.[0]?.trim() || "";
			const metaKeywords = JSON.parse(fields.metaKeywords?.[0]) || [];
			const oldImage = fields.old_image?.[0];

			if (!contentLang || !["en", "hi", "od"].includes(contentLang)) {
				return res.status(400).json({ message: "Invalid language" });
			}
			if (contentLang !== "en" && !titleRegional) {
				return res.status(400).json({ message: "Regional title required" });
			}
			if (!categoryId) {
				return res.status(400).json({ message: "Category is required" });
			}
			if (!title) {
				return res.status(400).json({ message: "Title is required" });
			}
			if (contentLang !== "en" && titleRegional === "") {
				return res.status(400).json({ message: "Regional Title is required" });
			}

			const existingNews = await newsModel.findById(news_id);
			if (!existingNews) {
				return res.status(404).json({ message: "News not found" });
			}

			const categoryExists = await categoryModel.findById(categoryId);
			if (!categoryExists) {
				return res.status(404).json({ message: "Category not found" });
			}

			let slug = slugify(title, { lower: true, strict: true });
			const slugExists = await newsModel.findOne({
				slug,
				contentLang,
				_id: { $ne: news_id },
			});
			if (slugExists) {
				slug = `${slug}-${Date.now()}`;
			}

			let imageUrl = oldImage || existingNews.image;
			if (files.new_image && files.new_image[0]) {
				cloudinary.config({
					cloud_name: process.env.cloudinary_cloud_name,
					api_key: process.env.cloudinary_api_key,
					api_secret: process.env.cloudinary_api_secret,
					secure: true,
				});

				// delete old image if exists
				if (existingNews.image) {
					const publicId = existingNews.image
						.split("/upload/")[1]
						.split("/")
						.slice(1)
						.join("/")
						.split(".")[0];
					await cloudinary.uploader.destroy(publicId);
				}
				const uploaded = await cloudinary.uploader.upload(
					files.new_image[0].filepath,
					{ folder: "news_images" }
				);
				imageUrl = uploaded.secure_url;
			}

			const updatedNews = await newsModel.findByIdAndUpdate(
				news_id,
				{
					contentLang,
					categoryId,
					title,
					titleRegional,
					slug,
					description,
					image: imageUrl,
					metaTitle,
					metaDescription,
					metaKeywords,
				},
				{ returnDocument: "after", runValidators: true }
			);
			return res.status(200).json({
				message: "News updated successfully",
				news: updatedNews,
			});
		} catch (error) {
			console.error("Update News Error:", error);
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
	};
	delete_news = async (req, res) => {
		const { news_id } = req.params;
		try {
			const news = await newsModel.findById(news_id);
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			if (news.image) {
				cloudinary.config({
					cloud_name: process.env.cloudinary_cloud_name,
					api_key: process.env.cloudinary_api_key,
					api_secret: process.env.cloudinary_api_secret,
					secure: true,
				});
				const imageUrl = news.image;
				const publicId = imageUrl.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(
					`news_images/${publicId}`,
					(error, result) => {
						if (error) {
							console.log("Error deleting image from cloudinary", error);
							return res
								.status(500)
								.json({ message: "Error deleting image from cloudinary" });
						}
						console.log(
							"Successfully deleted the image from cloudinary",
							result
						);
					}
				);
			}
			await newsModel.findByIdAndDelete(news_id);
			return res.status(200).json({ message: "News deleted successfully" });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	update_news_status = async (req, res) => {
		try {
			const { news_id, status } = req.body;
			if (!ObjectId.isValid(news_id)) {
				return res.status(400).json({ message: "Invalid news ID" });
			}
			const allowedStatus = newsModel.schema.path("status").enumValues;
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({
					message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`,
				});
			}
			const news = await newsModel.findById(news_id);
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			news.status = status;
			news.isPublished = true;
			if (status !== "published") {
				news.publishedAt = null;
				news.isPublished = false;
			}
			// Save (triggers pre("save"))
			await news.save();

			return res.status(200).json({
				message: "News status updated successfully",
				news,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
	};
	update_news_breaking = async (req, res) => {
		try {
			const { news_id, isBreaking } = req.body;
			const news = await newsModel.findByIdAndUpdate(
				news_id,
				{ isBreaking },
				{ returnDocument: true }
			);
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			res.json({
				success: true,
				message: "Breaking status updated",
				data: news,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	};
	update_news_featured = async (req, res) => {
		try {
			const { news_id, isFeatured } = req.body;
			const news = await newsModel.findByIdAndUpdate(
				news_id,
				{ isFeatured },
				{ returnDocument: true }
			);
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			res.json({
				success: true,
				message: "Featured status updated",
				data: news,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	};
	update_news_pinned = async (req, res) => {
		try {
			const { news_id, isPinned } = req.body;
			const news = await newsModel.findByIdAndUpdate(
				news_id,
				{ isPinned },
				{ returnDocument: true }
			);
			if (!news) {
				return res.status(404).json({ message: "News not found" });
			}
			res.json({
				success: true,
				message: "Pinned status updated",
				data: news,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	};
}
module.exports = new newsController();
