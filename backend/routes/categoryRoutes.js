const express = require("express");
const router = express.Router();
const middleware = require('../middlewares/middleware');
const categoryController = require("../controllers/categoryController");

router.put("/reorder", middleware.auth, categoryController.reorderCategories);
router.post("/",  middleware.auth, categoryController.createCategory);
router.get("/",  middleware.auth, categoryController.getAllCategories);
router.get("/:id",  middleware.auth, categoryController.getCategoryById);
router.put("/:id",  middleware.auth, categoryController.updateCategory);
router.delete("/:id",  middleware.auth, categoryController.deleteCategory);

module.exports = router;
