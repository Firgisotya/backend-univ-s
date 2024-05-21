var express = require("express");
const CommentController = require("../controllers/exam.controller");
var router = express.Router();

router.get("/", CommentController.index);
router.get("/:id", CommentController.show);
router.post("/", CommentController.store);
router.post("/submit", CommentController.submit);

module.exports = router;
