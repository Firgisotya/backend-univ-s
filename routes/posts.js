var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const PostController = require("../controllers/post.controller");

router.get("/", authMiddleware, PostController.index);
router.get("/get-by-user", authMiddleware, PostController.getByUser);
router
  .route("/:id")
  .get(authMiddleware, PostController.show)
  .delete(authMiddleware, PostController.destroy);
router.post("/", authMiddleware, PostController.store);

module.exports = router;
