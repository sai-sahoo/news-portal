const express = require("express");
const router = express.Router();
const newsController = require("../../controllers/public/newsController");

router.get("/breaking", newsController.getBreakingNews);
router.get("/featured", newsController.getFeaturedNews);
router.get("/category/:slug", newsController.getNewsByCategory);
router.get("/:slug", newsController.getNewsBySlug);
// router.get("/slug/:slug", categoryController.getCategoryBySlug);
// router.get("/:id", categoryController.getCategoryById);

module.exports = router;
