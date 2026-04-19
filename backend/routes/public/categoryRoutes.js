const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/public/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/homepage", categoryController.getAllHomeCategories);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
// router.get("/:id", categoryController.getCategoryById);

module.exports = router;
