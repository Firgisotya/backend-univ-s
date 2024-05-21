var express = require("express");
const CommentController = require("../controllers/comment.controller");
var router = express.Router();

// router.delete(CommentController.destroy);
router.post("/", CommentController.store);

module.exports = router;
