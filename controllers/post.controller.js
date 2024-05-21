const { successResponse, errorResponse } = require("../utils/Response");
const {
  findAll,
  findById,
  findByUser,
  store,
  destroy,
  filterByDesc,
} = require("../services/post.service");
const { verifyToken } = require("../utils/processToken");
module.exports = {
  index: async (req, res) => {
    try {
      const { authorization } = req.headers;
      const { desc } = req.query;
      req.user = verifyToken(authorization);
      let posts;
      if (desc) {
        posts = await filterByDesc(desc);
      } else {
        posts = await findAll();
      }
      return successResponse(
        res,
        200,
        posts,
        "Successfully retrieved all posts"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  getByUser: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const posts = await findByUser(req.user.id);
      return successResponse(res, 200, posts, "Successfully retrieved posts");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      const post = await store(req.body);
      return successResponse(res, 200, post, "Successfully created post");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await findById(id);
      if (post) {
        return successResponse(res, 200, post, "Successfully retrieved post");
      }
      return errorResponse(res, 404, "Post not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const post = await findById(id);
      if (post) {
        if (post.userId !== req.user.id) {
          return errorResponse(
            res,
            401,
            "You are not authorized to delete this post"
          );
        }
        await destroy(id);
        return successResponse(res, 200, "Successfully deleted post");
      }
      return errorResponse(res, 404, "Post not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
