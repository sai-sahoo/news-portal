const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/newsCount", middleware.auth, dashboardController.getNewsCount);

module.exports = router;
