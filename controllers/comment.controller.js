const { successResponse, errorResponse } = require("../utils/Response");
const { store, destroy } = require("../services/comment.service");
const { findById } = require("../services/post.service");
const { verifyToken } = require("../utils/processToken");
module.exports = {
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      const post = await findById(req.body.postId);
      if (!post) {
        return errorResponse(res, 404, "Post not found");
      }
      const comment = await store(req.body);
      return successResponse(res, 200, comment, "Successfully created comment");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await findById(id);
      if (comment) {
        await destroy(id);
        return successResponse(res, 200, "Successfully deleted comment");
      }
      return errorResponse(res, 404, "Comment not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
