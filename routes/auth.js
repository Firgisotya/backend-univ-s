var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const AuthController = require("../controllers/auth.controller");

router.get("/user", authMiddleware, AuthController.getAuth);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/send-email", AuthController.sendMail);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
