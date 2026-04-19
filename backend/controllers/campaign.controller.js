// controllers/campaign.controller.js

const Campaign = require("../models/campaign.model");
const Advertiser = require("../models/advertiser.model");

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);

    res.status(201).json({
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, advertiser } = req.query;

    const filter = { isDeleted: false };

    if (status) filter.status = status;
    if (advertiser) filter.advertiser = advertiser;

    const campaigns = await Campaign.find(filter)
      .populate("advertiser", "name company")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("advertiser");

    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.toggleCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    campaign.status =
      campaign.status === "active" ? "paused" : "active";

    await campaign.save();

    res.json({
      message: "Campaign status updated",
      campaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    campaign.isDeleted = true;
    campaign.status = "completed";

    await campaign.save();

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};