// routes/creative.routes.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/creative.controller");
const middleware = require("../middlewares/middleware");


router.post("/", middleware.auth, controller.createCreative);
router.get("/", middleware.auth, controller.getCreatives);
router.get("/:id", middleware.auth, controller.getCreativeById);
router.put("/:id", middleware.auth, controller.updateCreative);
router.patch("/:id/toggle", middleware.auth, controller.toggleCreative);
router.delete("/:id", middleware.auth, controller.deleteCreative);

module.exports = router;
