// models/advertiser.model.js

const mongoose = require("mongoose");

const advertiserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		company: {
			type: String,
			trim: true,
		},

		email: {
			type: String,
			lowercase: true,
			trim: true,
		},

		phone: String,

		website: String,

		billingModel: {
			type: String,
			enum: ["prepaid", "postpaid"],
			default: "prepaid",
		},

		status: {
			type: String,
			enum: ["active", "inactive"],
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

// Indexes
advertiserSchema.index({ name: 1 });
advertiserSchema.index({ email: 1 });

module.exports = mongoose.model("Advertiser", advertiserSchema);
