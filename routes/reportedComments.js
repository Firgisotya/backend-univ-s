var express = require("express");
const ReportedCommentController = require("../controllers/reportedComment.controller");
var router = express.Router();

router.get("/:id", ReportedCommentController.store);

module.exports = router;
