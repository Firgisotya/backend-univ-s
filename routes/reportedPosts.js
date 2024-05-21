var express = require("express");
const ReportedPostController = require("../controllers/reportedPost.controller");
var router = express.Router();

router.get("/:id", ReportedPostController.store);

module.exports = router;
