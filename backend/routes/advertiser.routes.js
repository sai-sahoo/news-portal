// routes/advertiser.routes.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/advertiser.controller");
const middleware = require("../middlewares/middleware");


router.post("/", middleware.auth, controller.createAdvertiser);
router.get("/", middleware.auth, controller.getAdvertisers);
router.get("/:id", middleware.auth, controller.getAdvertiserById);
router.put("/:id", middleware.auth, controller.updateAdvertiser);
router.patch("/:id/toggle", middleware.auth, controller.toggleAdvertiser);
router.delete("/:id", middleware.auth, controller.deleteAdvertiser);

module.exports = router;
