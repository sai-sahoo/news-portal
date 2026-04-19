const News = require("../../models/newsModel");
const Category = require("../../models/categoryModel");

// GET NEWS BY CATEGORY
exports.getNewsByCategory = async (req, res) => {
	try {
		const { slug } = req.params;
		const { lang } = req.query;

		const category = await Category.findOne({
			slug,
			contentLang: lang,
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// 🔥 Get all descendants using graphLookup
		const categories = await Category.aggregate([
			{
				$match: {
					_id: category._id,
					contentLang: lang,
					isActive: true,
				},
			},
			{
				$graphLookup: {
					from: "categories",
					startWith: "$_id",
					connectFromField: "_id",
					connectToField: "parentCategory",
					as: "descendants",
					restrictSearchWithMatch: {
						contentLang: lang,
						isActive: true,
					},
				},
			},
		]);

		const allCategoryIds = [
			category._id,
			...categories[0].descendants.map((c) => c._id),
		];

		const news = await News.find({
			categoryId: { $in: allCategoryIds },
			contentLang: lang,
			isPublished: true,
		})
			.sort({ publishedAt: -1 })
			.limit(20);

		res.json({
			success: true,
			data: news,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getNewsBySlug = async (req, res) => {
	try {
		const { slug } = req.params;
		const { lang } = req.query;

		const news = await News.findOne({
			slug,
			contentLang: lang,
			isPublished: true,
		});

		if (!news) {
			return res.status(404).json({ success: false });
		}

		res.json({
			success: true,
			data: news,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getBreakingNews = async (req, res) => {
	try {
		const { lang } = req.query;

		const breakingNews = await News.find({
			isBreaking: true,
			contentLang: lang,
			isPublished: true,
		})
			.sort({ publishedAt: -1 })
			.limit(5);

		if (!breakingNews) {
			return res.status(404).json({ success: false });
		}

		res.json({
			success: true,
			data: breakingNews,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getFeaturedNews = async (req, res) => {
	try {
		const { lang } = req.query;
		const articles = await News.aggregate([
			{
				$match: {
					contentLang: lang,
					isPublished: true,
					status: "published",
					isFeatured: true,
				},
			},
			// Join with Category
			{
				$lookup: {
					from: "categories", // collection name (important)
					localField: "categoryId",
					foreignField: "_id",
					as: "category",
				},
			},
			{
				$unwind: "$category",
			},
			// Optional: filter active categories
			{
				$match: {
					"category.isActive": true,
				},
			},
			// Shape response
			{
				$project: {
					title: 1,
					titleRegional: 1,
					slug: 1,
					image: 1,
					description: 1,
					metaDescription: 1,
					publishedAt: 1,
					views: 1,
					categoryName: "$category.name",
					categoryNameRegional: "$category.nameRegional",
					categorySlug: "$category.slug",
				},
			},
			// Sorting
			{
				$sort: { publishedAt: -1 },
			},
			// Limit (important for homepage)
			{
				$limit: 4,
			},
		]);

		res.json({
			success: true,
			data: articles,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch featured articles",
		});
	}
};
