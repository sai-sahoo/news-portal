// models/placement.model.js

const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		code: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		size: {
			type: String,
			enum: ["728x90", "160x600", "250x250", "320x50", "320x480", "320x568"],
			required: true,
		},

		pageType: {
			type: String,
			enum: ["homepage", "article", "category", "mobile"],
			required: true,
		},

		description: String,

		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},

		isDeleted: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{ timestamps: true }
);

// Performance indexes
placementSchema.index({ pageType: 1, isActive: 1, isDeleted: 1 });

module.exports = mongoose.model("Placement", placementSchema);
