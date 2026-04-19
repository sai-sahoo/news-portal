// routes/campaign.routes.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/campaign.controller");
const middleware = require("../middlewares/middleware");


router.post("/", middleware.auth, controller.createCampaign);
router.get("/", middleware.auth, controller.getCampaigns);
router.get("/:id", middleware.auth, controller.getCampaignById);
router.put("/:id", middleware.auth, controller.updateCampaign);
router.patch("/:id/toggle", middleware.auth, controller.toggleCampaign);
router.delete("/:id", middleware.auth, controller.deleteCampaign);

module.exports = router;
