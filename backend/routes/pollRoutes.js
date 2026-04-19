const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");
const pollController = require("../controllers/pollController");

router.post("/", middleware.auth, pollController.createPoll);
router.get("/", middleware.auth, pollController.getPolls);
router.get("/:id", middleware.auth, pollController.getPollById);
router.put("/:id", middleware.auth, pollController.updatePoll);
router.delete("/:id", middleware.auth, pollController.deletePoll);

module.exports = router;