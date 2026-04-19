const Category = require("../models/categoryModel");
const slugify = require("slugify");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
	try {
		const {
			contentLang,
			name,
			nameRegional,
			description,
			parentCategory,
			image,
			isActive,
			showInMenu,
			showInHomePage,
			metaTitle,
			metaDescription,
		} = req.body;

		if (!name || !contentLang) {
			return res.status(400).json({
				success: false,
				message: "Category name and content language are required",
			});
		}
		if (!["en", "hi", "od"].includes(contentLang)) {
			return res.status(400).json({ message: "Invalid language" });
		}

		const slug = slugify(name, { lower: true, strict: true });

		// 🔹 Normalize parent
		const normalizedParent = parentCategory === "" ? null : parentCategory;

		// 🔹 Find highest order among siblings
		const lastCategory = await Category.findOne({
			parentCategory: normalizedParent,
			contentLang,
		})
			.sort({ order: -1 })
			.select("order");

		const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

		const category = new Category({
			contentLang,
			name,
			nameRegional,
			slug,
			description,
			parentCategory: normalizedParent,
			image,
			isActive,
			showInMenu,
			showInHomePage,
			order: nextOrder,
			metaTitle,
			metaDescription,
		});

		await category.save();

		res.status(201).json({
			success: true,
			message: "Category created successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

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
		}).sort({
			parentCategory: 1,
			order: 1,
		});

		res.json({ success: true, data: categories });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
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

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
	try {
		const {
			contentLang,
			name,
			nameRegional,
			description,
			parentCategory,
			image,
			isActive,
			showInMenu,
			showInHomePage,
			metaTitle,
			metaDescription,
		} = req.body;

		if (!name || !contentLang) {
			return res.status(400).json({
				success: false,
				message: "Category name and content language are required",
			});
		}
		if (!["en", "hi", "od"].includes(contentLang)) {
			return res.status(400).json({ message: "Invalid language" });
		}

		const slug = slugify(name, { lower: true, strict: true });

		const normalizedParent = parentCategory === "" ? null : parentCategory;

		const category = await Category.findByIdAndUpdate(
			req.params.id,
			{
				contentLang,
				name,
				nameRegional,
				slug,
				description,
				parentCategory: normalizedParent,
				image,
				isActive,
				showInMenu,
				showInHomePage,
				metaTitle,
				metaDescription,
			},
			{ returnDocument: "after" }
		);
		if (!category)
			return res.status(404).json({ message: "Category not found" });

		res.json({
			success: true,
			message: "Category updated successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category)
			return res.status(404).json({ message: "Category not found" });

		const children = await Category.find({
			parentCategory: category._id,
			contentLang: category.contentLang,
		});
		if (children.length > 0) {
			return res.status(400).json({
				message: "Cannot delete category with subcategories",
			});
		}
		await Category.findByIdAndDelete(req.params.id);
		res.json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.reorderCategories = async (req, res) => {
	try {
		const updates = req.body;
		// expecting: [{ _id, order }]
		if (!Array.isArray(updates)) {
			return res.status(400).json({
				success: false,
				message: "Invalid data format",
			});
		}
		const parentData = await Category.findById(updates[0]._id).select(
			"parentCategory contentLang"
		);

		const invalid = await Category.find({
			_id: { $in: updates.map((u) => u._id) },
			$or: [
				{ parentCategory: { $ne: parentData.parentCategory } },
				{ contentLang: { $ne: parentData.contentLang } },
			],
		});

		if (invalid.length > 0) {
			return res.status(400).json({
				success: false,
				message: "Cross-parent reorder not allowed",
			});
		}

		await Promise.all(
			updates.map((item) =>
				Category.findByIdAndUpdate(
					item._id,
					{ order: item.order },
					{ returnDocument: "after" }
				)
			)
		);
		res.json({
			success: true,
			message: "Category order updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
