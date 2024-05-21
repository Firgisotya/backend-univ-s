const { successResponse, errorResponse } = require("../utils/Response");
const { store, findUnique } = require("../services/reportedComment.service");
const { findById } = require("../services/comment.service");
const { verifyToken } = require("../utils/processToken");
const { parse } = require("dotenv");
module.exports = {
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const comment = await findById(req.params.id);
      if (!comment) {
        return errorResponse(res, 404, "Comment not found");
      }
      const data = {
        commentId: parseInt(req.params.id),
        userId: parseInt(req.user.id),
      };
      const findData = findUnique(data.userId, data.commentId);
      if (findData) {
        return errorResponse(
          res,
          400,
          "You have already reported this comment"
        );
      }
      await store(data);
      return successResponse(res, 200, "Successfully reported comment");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
