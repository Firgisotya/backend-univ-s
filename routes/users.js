var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.index);
router.route("/:id").get(UserController.show);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/update",  UserController.update);

module.exports = router;
