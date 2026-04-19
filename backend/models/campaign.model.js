// models/campaign.model.js

const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
	{
		advertiser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Advertiser",
			required: true,
			index: true,
		},

		name: {
			type: String,
			required: true,
			trim: true,
		},

		pricingModel: {
			type: String,
			enum: ["CPM", "CPC", "Flat"],
			required: true,
		},

		rate: {
			type: Number,
			required: true, // CPM rate per 1000 OR CPC rate per click OR flat amount
		},

		budget: {
			type: Number,
			required: true,
		},

		dailyBudget: Number,

		spent: {
			type: Number,
			default: 0,
			index: true,
		},

		startDate: {
			type: Date,
			required: true,
			index: true,
		},

		endDate: {
			type: Date,
			required: true,
			index: true,
		},

		status: {
			type: String,
			enum: ["draft", "active", "paused", "completed"],
			default: "draft",
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

// Important index for serving engine
campaignSchema.index({ status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);
