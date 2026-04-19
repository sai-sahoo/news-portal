const mongoose = require("mongoose");
const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;
const Creative = require("../models/creative.model");
const Placement = require("../models/placement.model");

exports.createCreative = async (req, res) => {
	try {
		const form = formidable({
			multiples: false, // 🔥 important
			keepExtensions: true,
		});

		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.status(400).json({ message: "Form parse error" });
			}

			// 🔥 Normalize helper
			const getValue = (field) => (Array.isArray(field) ? field[0] : field);

			const campaign = getValue(fields.campaign);
			const placement = getValue(fields.placement);
			const title = getValue(fields.title);
			const type = getValue(fields.type);
			const clickUrl = getValue(fields.clickUrl);
			const weight = Number(getValue(fields.weight) || 1);
			const status = getValue(fields.status);
			const htmlCode = getValue(fields.htmlCode);
			const scriptCode = getValue(fields.scriptCode);

			// Validate placement
			const placementDoc = await Placement.findById(placement);
			if (!placementDoc) {
				return res.status(400).json({ message: "Invalid placement" });
			}

			let imageUrl = "";

			// 🔥 Cloudinary config (only once ideally in app.js, but keeping here safe)
			cloudinary.config({
				cloud_name: process.env.cloudinary_cloud_name,
				api_key: process.env.cloudinary_api_key,
				api_secret: process.env.cloudinary_api_secret,
				secure: true,
			});

			// Handle image upload safely
			if (type === "image" && files.image) {
				const imageFile = Array.isArray(files.image)
					? files.image[0]
					: files.image;

				const result = await cloudinary.uploader.upload(imageFile.filepath, {
					folder: "ad_creatives",
				});

				imageUrl = result.secure_url;
			}

			const creative = await Creative.create({
				campaign,
				placement,
				title,
				type,
				size: placementDoc.size,
				imageUrl: type === "image" ? imageUrl : undefined,
				htmlCode: type === "html" ? htmlCode : undefined,
				scriptCode: type === "script" ? scriptCode : undefined,
				clickUrl: clickUrl || undefined,
				weight,
				status: status || "active",
			});

			return res.status(201).json({
				message: "Creative created successfully",
				creative,
			});
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.getCreatives = async (req, res) => {
	try {
		const { page = 1, limit = 10, campaign, placement, status } = req.query;

		const filter = { isDeleted: false };

		if (campaign) filter.campaign = campaign;
		if (placement) filter.placement = placement;
		if (status) filter.status = status;

		const creatives = await Creative.find(filter)
			.populate("campaign", "name")
			.populate("placement", "name size")
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort({ createdAt: -1 });

		const total = await Creative.countDocuments(filter);

		res.json({
			creatives,
			totalPages: Math.ceil(total / limit),
			total,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.getCreativeById = async (req, res) => {
	try {
		const { id } = req.params;

		// 🔹 Validate Mongo ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				message: "Invalid creative ID",
			});
		}

		// 🔹 Find creative (exclude soft deleted)
		const creative = await Creative.findOne({
			_id: id,
			isDeleted: false,
		})
			.populate("campaign", "name status startDate endDate budget spent")
			.populate("placement", "name size status slug");

		if (!creative) {
			return res.status(404).json({
				message: "Creative not found",
			});
		}

		return res.status(200).json({
			creative,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to fetch creative",
			error: error.message,
		});
	}
};
exports.updateCreative = async (req, res) => {
	try {
		const form = formidable({
			multiples: false,
			keepExtensions: true,
		});

		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.status(400).json({ message: "Form parse error" });
			}

			const creative = await Creative.findById(req.params.id);
			if (!creative) {
				return res.status(404).json({ message: "Creative not found" });
			}

			const getValue = (field) => (Array.isArray(field) ? field[0] : field);

			const campaign = getValue(fields.campaign);
			const placement = getValue(fields.placement);
			const title = getValue(fields.title);
			const type = getValue(fields.type);
			const clickUrl = getValue(fields.clickUrl);
			const weight = Number(getValue(fields.weight) || creative.weight);
			const status = getValue(fields.status);
			const htmlCode = getValue(fields.htmlCode);
			const scriptCode = getValue(fields.scriptCode);

			// If placement changed, update size
			let placementDoc = null;
			if (placement) {
				placementDoc = await Placement.findById(placement);
				if (!placementDoc) {
					return res.status(400).json({ message: "Invalid placement" });
				}
			}

			let imageUrl = creative.imageUrl;

			cloudinary.config({
				cloud_name: process.env.cloudinary_cloud_name,
				api_key: process.env.cloudinary_api_key,
				api_secret: process.env.cloudinary_api_secret,
				secure: true,
			});

			// Handle new image upload
			if (type === "image" && files.image) {
				const imageFile = Array.isArray(files.image)
					? files.image[0]
					: files.image;

				const result = await cloudinary.uploader.upload(imageFile.filepath, {
					folder: "ad_creatives",
				});

				imageUrl = result.secure_url;
			}

			// Update fields safely
			creative.campaign = campaign || creative.campaign;
			creative.placement = placement || creative.placement;
			creative.title = title || creative.title;
			creative.type = type || creative.type;
			creative.size = placementDoc ? placementDoc.size : creative.size;
			creative.imageUrl = type === "image" ? imageUrl : undefined;
			creative.htmlCode = type === "html" ? htmlCode : undefined;
			creative.scriptCode = type === "script" ? scriptCode : undefined;
			creative.clickUrl = clickUrl || undefined;
			creative.weight = weight;
			creative.status = status || creative.status;

			await creative.save();

			return res.json({
				message: "Creative updated successfully",
				creative,
			});
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.toggleCreative = async (req, res) => {
	try {
		const creative = await Creative.findById(req.params.id);

		creative.status = creative.status === "active" ? "paused" : "active";

		await creative.save();

		res.json({
			message: "Creative status updated",
			creative,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.deleteCreative = async (req, res) => {
	try {
		const creative = await Creative.findById(req.params.id);

		creative.isDeleted = true;
		creative.status = "paused";

		await creative.save();

		res.json({ message: "Creative deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
