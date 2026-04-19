// models/creative.model.js

const mongoose = require("mongoose");

const creativeSchema = new mongoose.Schema(
	{
		campaign: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Campaign",
			required: true,
			index: true,
		},

		placement: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Placement",
			required: true,
			index: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		type: {
			type: String,
			enum: ["image", "html", "script"],
			default: "image",
		},

		size: {
			type: String,
			required: true,
		},

		imageUrl: String,
		htmlCode: String,
		scriptCode: String,
		clickUrl: String,

		weight: {
			type: Number,
			default: 1,
		},

		impressions: {
			type: Number,
			default: 0,
		},

		clicks: {
			type: Number,
			default: 0,
		},

		status: {
			type: String,
			enum: ["active", "paused"],
			default: "active",
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

creativeSchema.index({ placement: 1, status: 1, isDeleted: 1 });

module.exports = mongoose.model("Creative", creativeSchema);
