const Placement = require("../models/placement.model");

// CREATE
exports.createPlacement = async (req, res) => {
	try {
		const existing = await Placement.findOne({
			code: req.body.code,
			isDeleted: false,
		});

		if (existing) {
			return res.status(400).json({
				message: "Placement code already exists",
			});
		}

		const placement = await Placement.create(req.body);

		res.status(201).json({
			message: "Placement created successfully",
			placement,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// GET ALL (with filter + pagination)
exports.getPlacements = async (req, res) => {
	try {
		const { page = 1, limit = 10, pageType, isActive } = req.query;

		const filter = { isDeleted: false };

		if (pageType) filter.pageType = pageType;
		if (isActive !== undefined) filter.isActive = isActive === "true";

		const placements = await Placement.find(filter)
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort({ createdAt: -1 });

		const total = await Placement.countDocuments(filter);

		res.json({
			placements,
			total,
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// GET ONE
exports.getPlacementById = async (req, res) => {
	try {
		const placement = await Placement.findOne({
			_id: req.params.id,
			isDeleted: false,
		});

		if (!placement) {
			return res.status(404).json({ message: "Placement not found" });
		}

		res.json({ placement });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// UPDATE
exports.updatePlacement = async (req, res) => {
	try {
		const placement = await Placement.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!placement) {
			return res.status(404).json({ message: "Placement not found" });
		}

		res.json({
			message: "Placement updated successfully",
			placement,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// TOGGLE ACTIVE
exports.togglePlacement = async (req, res) => {
	try {
		const placement = await Placement.findById(req.params.id);

		if (!placement) {
			return res.status(404).json({ message: "Placement not found" });
		}

		placement.isActive = !placement.isActive;
		await placement.save();

		res.json({
			message: "Placement status updated",
			placement,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// DELETE
exports.deletePlacement = async (req, res) => {
	try {
		const placement = await Placement.findById(req.params.id);

		if (!placement) {
			return res.status(404).json({ message: "Placement not found" });
		}

		placement.isDeleted = true;
		placement.isActive = false;
		await placement.save();

		res.json({
			message: "Placement deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
