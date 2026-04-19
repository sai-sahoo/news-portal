const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		contentLang: {
			type: String,
			required: true,
			enum: ["en", "hi", "od"],
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
		},
		nameRegional: {
			type: String,
			trim: true,
			required: function () {
				return this.contentLang !== "en";
			},
		},
		description: String,
		parentCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		},
		image: String,
		isActive: {
			type: Boolean,
			default: true,
		},
		showInMenu: {
			type: Boolean,
			default: true,
		},
		showInHomePage: {
			type: Boolean,
			default: false,
		},
		order: {
			type: Number,
			default: 0,
		},
		metaTitle: String,
		metaDescription: String,
	},
	{ timestamps: true }
);

/* 🔥 NEW INDEXES */

// Unique name per parent and lang
categorySchema.index(
  { name: 1, contentLang: 1, parentCategory: 1 },
  { unique: true }
);
categorySchema.index(
  { slug: 1, contentLang: 1 },
  { unique: true }
);
// Faster tree sorting
categorySchema.index({ parentCategory: 1, order: 1 });

// Add index for graph traversal
categorySchema.index({ parentCategory: 1, contentLang: 1 });

module.exports = mongoose.model("Category", categorySchema);
