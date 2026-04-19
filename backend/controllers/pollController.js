const pollModel = require("../models/pollModel");

class pollController {
	createPoll = async (req, res) => {
		try {
			const { contentLang, question, options } = req.body;

			// Validation
			if (!contentLang || !["en", "hi", "od"].includes(contentLang)) {
				return res.status(400).json({ message: "Invalid language" });
			}
			if (!question) {
				return res
					.status(400)
					.json({ success: false, message: "Question is required" });
			}

			if (!options || options.length < 2) {
				return res
					.status(400)
					.json({ success: false, message: "Minimum 2 options required" });
			}

			const poll = new pollModel({
				contentLang,
				question,
				options: options.map((opt) => ({ text: opt })),
			});

			await poll.save();

			res.status(201).json({
				success: true,
				message: "Poll created successfully",
				poll,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
	getPolls = async (req, res) => {
		try {
			const { lang } = req.query;
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;
			const skip = (page - 1) * limit;
			let filter = {};

			if (!lang) {
				return res.status(400).json({
					success: false,
					message: "Language is required",
				});
			}
			if (lang) {
				filter.contentLang = lang;
			}

			const [polls, total] = await Promise.all([
				pollModel
					.find(filter)
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				pollModel.countDocuments(filter),
			]);
			return res.status(200).json({
				success: true,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				polls,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	};
	getPollById = async (req, res) => {
		const { id } = req.params;
		try {
			const poll = await pollModel.findById(id);
			if (!poll) {
				return res
					.status(404)
					.json({ success: false, message: "Poll not found" });
			} else {
				return res.status(200).json({ success: true, poll });
			}
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	};
	updatePoll = async (req, res) => {
		try {
			const { contentLang, question, options, status } = req.body;
			// Validation
			if (!contentLang || !["en", "hi", "od"].includes(contentLang)) {
				return res.status(400).json({ message: "Invalid language" });
			}
			if (!question) {
				return res
					.status(400)
					.json({ success: false, message: "Question is required" });
			}

			if (!options || options.length < 2) {
				return res
					.status(400)
					.json({ success: false, message: "Minimum 2 options required" });
			}

			const poll = await pollModel.findById(req.params.id);
			if (!poll) {
				return res
					.status(404)
					.json({ success: false, message: "Poll not found" });
			}

			poll.contentLang = contentLang;
			poll.question = question;
			poll.status = status;

			// Replace options
			poll.options = options.map((opt) => ({
				text: opt,
				votes: opt.votes || 0,
			}));

			await poll.save();

			res.json({
				success: true,
				message: "Poll updated",
				poll,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
	deletePoll = async (req, res) => {
		const { id } = req.params;
		try {
			const poll = await pollModel.findByIdAndDelete(id);
			if (!poll) {
				return res
					.status(404)
					.json({ success: false, message: "Poll not found" });
			}
			return res
				.status(200)
				.json({ success: true, message: "Poll deleted successfully" });
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	};
}

module.exports = new pollController();
