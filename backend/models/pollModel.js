const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	votes: {
		type: Number,
		default: 0,
	},
});

const pollSchema = new mongoose.Schema(
	{
		contentLang: {
			type: String,
			required: true,
			enum: ["en", "hi", "od"],
			index: true,
		},
		question: {
			type: String,
			required: true,
		},
		options: {
			type: [optionSchema],
			validate: [arrayLimit, "At least 2 options required"],
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

function arrayLimit(val) {
	return val.length >= 2;
}

module.exports = mongoose.model("Poll", pollSchema);
