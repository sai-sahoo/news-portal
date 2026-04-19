const express = require("express");
const router = express.Router();
const placementController = require("../controllers/placement.controller");
const middleware = require("../middlewares/middleware");


router.post("/", middleware.auth, placementController.createPlacement);
router.get("/", middleware.auth, placementController.getPlacements);
router.get("/:id", middleware.auth, placementController.getPlacementById);
router.put("/:id", middleware.auth, placementController.updatePlacement);
router.patch("/:id/toggle", middleware.auth, placementController.togglePlacement);
router.delete("/:id", middleware.auth, placementController.deletePlacement);

module.exports = router;