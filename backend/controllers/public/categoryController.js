const Category = require("../../models/categoryModel");

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
	try {
		const { lang } = req.query;

		if (!lang) {
			return res.status(400).json({
				success: false,
				message: "Language is required",
			});
		}

		const categories = await Category.find({
			contentLang: lang,
			isActive: { $eq: true },
			showInMenu: { $eq: true },
		})
			.sort({ parentCategory: 1, order: 1 })
			.lean(); // 🔥 improves performance
		// console.log(categories);
		res.json({
			success: true,
			count: categories.length,
			data: categories,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// GET ALL HOME CATEGORIES
exports.getAllHomeCategories = async (req, res) => {
	try {
		const { lang } = req.query;

		if (!lang) {
			return res.status(400).json({
				success: false,
				message: "Language is required",
			});
		}

		const categories = await Category.find({
			contentLang: lang,
			isActive: { $eq: true },
			showInHomePage: { $eq: true },
		})
			.sort({ parentCategory: 1, order: 1 })
			.lean(); // 🔥 improves performance
		// console.log(categories);
		res.json({
			success: true,
			count: categories.length,
			data: categories,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// GET SINGLE CATEGORY
exports.getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category)
			return res.status(404).json({ message: "Category not found" });

		res.json({ success: true, data: category });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
// GET CATEGORY BY SLUG
exports.getCategoryBySlug = async (req, res) => {
	try {
		const { slug } = req.params;
		const { lang } = req.query;

		const category = await Category.findOne({
			slug,
			contentLang: lang,
			isActive: true,
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		res.json({ success: true, data: category });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
