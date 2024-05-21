const { successResponse, errorResponse } = require("../utils/Response");
const { store, findUnique } = require("../services/reportedPost.service");
const { findById } = require("../services/post.service");
const { verifyToken } = require("../utils/processToken");
module.exports = {
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const post = await findById(req.params.id);
      if (!post) {
        return errorResponse(res, 404, "Post not found");
      }
      const data = {
        postId: parseInt(req.params.id),
        userId: parseInt(req.user.id),
      };
      const findData = findUnique(data.userId, data.postId);
      if (findData) {
        return errorResponse(res, 400, "You have already reported this post");
      }
      await store(data);
      return successResponse(res, 200, "Successfully reported post");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
