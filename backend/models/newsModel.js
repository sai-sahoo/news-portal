const { model, Schema } = require("mongoose");

const newsSchema = new Schema(
	{
		contentLang: {
			type: String,
			required: true,
			enum: ["en", "hi", "od"],
			index: true,
		},
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
			index: true,
		},
		writerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "authors",
			index: true,
		},
		writerName: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		titleRegional: {
			type: String,
			trim: true,
			// required: function () {
			// 	return this.contentLang !== "en";
			// },
		},
		slug: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			default: null,
		},
		description: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["draft", "pending", "approved", "rejected", "published"],
			default: "pending",
			index: true,
		},
		isPublished: {
			type: Boolean,
			default: false,
			index: true,
		},
		publishedAt: {
			type: Date,
			default: null,
			index: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isBreaking: {
			type: Boolean,
			default: false,
		},
		isPinned: {
			type: Boolean,
			default: false,
		},
		views: {
			type: Number,
			default: 0,
		},
		metaTitle: {
			type: String,
			default: "",
			trim: true,
		},
		metaDescription: {
			type: String,
			default: "",
			trim: true,
		},
		metaKeywords: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true }
);

newsSchema.index({ slug: 1, contentLang: 1 }, { unique: true });
newsSchema.index({ title: "text" });
newsSchema.pre("save", function () {
	if (this.isModified("status") && this.status === "published") {
		this.publishedAt = new Date();
	}
});


module.exports = model("Article", newsSchema);
