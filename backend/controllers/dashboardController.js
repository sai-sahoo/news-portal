const { mongoose } = require("mongoose");
const newsModel = require("../models/newsModel");
const { ObjectId } = mongoose.Types;

const getNewsCount = async (req, res) => {
	try {
		const { id, role } = req.userInfo;

		// 1. Get Query Params with Defaults
		const contentLang = req.query.contentLang || "en";
		const duration = req.query.duration || "Last 7 days";

		// 2. Build the MongoDB Filter Object
		let filter = { contentLang: contentLang };

		// If not admin, they only see their own articles
		if (role !== "admin") {
			filter.writerId = new ObjectId(id);
		}

		// 3. Handle Date Logic
		if (duration !== "All") {
			let startDate = new Date();
			startDate.setHours(0, 0, 0, 0); // Start from beginning of the day

			if (duration === "Last 7 days") {
				startDate.setDate(startDate.getDate() - 7);
			} else if (duration === "Last 30 days") {
				startDate.setDate(startDate.getDate() - 30);
			}
			// "Today" stays at the 00:00:00 set above

			filter.createdAt = { $gte: startDate };
		}

		// 4. Single-pass Aggregation
		const stats = await newsModel.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: null, // We are already filtered by lang, so we group everything remaining
					totalNews: { $sum: 1 },
					published: {
						$sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
					},
					pending: {
						$sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
					},
					draft: {
						$sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
					},
					rejected: {
						$sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
					},
				},
			},
			{
				$project: {
					_id: 0,
					totalNews: 1,
					published: 1,
					pending: 1,
					draft: 1,
					rejected: 1,
				},
			},
		]);

		// Default response if no data is found for the selected filter
		const result = stats[0] || {
			totalNews: 0,
			published: 0,
			pending: 0,
			draft: 0,
			rejected: 0,
		};

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		console.error("Dashboard Stats Error:", error);
		return res.status(500).json({
			message: "Something went wrong fetching counts",
		});
	}
};
module.exports = { getNewsCount };
