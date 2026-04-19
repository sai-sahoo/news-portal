const Advertiser = require("../models/advertiser.model");
const Campaign = require("../models/campaign.model");


exports.createAdvertiser = async (req, res) => {
	try {
		const advertiser = await Advertiser.create(req.body);

		res.status(201).json({
			message: "Advertiser created successfully",
			advertiser,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.getAdvertisers = async (req, res) => {
	try {
		const { page = 1, limit = 10, search } = req.query;

		const filter = { isDeleted: false };

		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}

		const advertisers = await Advertiser.find(filter)
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort({ createdAt: -1 });

		const total = await Advertiser.countDocuments(filter);

		// Add campaign count
		const enriched = await Promise.all(
			advertisers.map(async (adv) => {
				const campaignCount = await Campaign.countDocuments({
					advertiser: adv._id,
				});

				return {
					...adv._doc,
					campaignCount,
				};
			})
		);

		res.json({
			advertisers: enriched,
			totalPages: Math.ceil(total / limit),
			total,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.getAdvertiserById = async (req, res) => {
	try {
		const advertiser = await Advertiser.findOne({
			_id: req.params.id,
			isDeleted: false,
		});

		if (!advertiser) {
			return res.status(404).json({ message: "Advertiser not found" });
		}

		res.json({ advertiser });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.updateAdvertiser = async (req, res) => {
	try {
		const advertiser = await Advertiser.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		res.json({
			message: "Advertiser updated successfully",
			advertiser,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.toggleAdvertiser = async (req, res) => {
	try {
		const advertiser = await Advertiser.findById(req.params.id);

		advertiser.status = advertiser.status === "active" ? "inactive" : "active";

		await advertiser.save();

		res.json({
			message: "Advertiser status updated",
			advertiser,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.deleteAdvertiser = async (req, res) => {
	try {
		const advertiser = await Advertiser.findById(req.params.id);

		advertiser.isDeleted = true;
		advertiser.status = "inactive";

		await advertiser.save();

		res.json({ message: "Advertiser deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
