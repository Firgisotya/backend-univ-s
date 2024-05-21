const { successResponse, errorResponse } = require("../utils/Response");
const bcrypt = require("bcryptjs");
const { findAll, findById, update } = require("../services/user.service");

const { requestValidation } = require("../utils/RequestValidation");
const { verifyToken } = require("../utils/processToken");
const moment = require("moment");
module.exports = {
  index: async (req, res) => {
    try {
      const users = await findAll();
      return successResponse(
        res,
        200,
        users,
        "Successfully retrieved all users"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await findById(id);
      if (user) {
        return successResponse(res, 200, user, "Successfully retrieved user");
      }
      return errorResponse(res, 404, "User not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const schema = {
        oldPassword: "string|min:6",
        newPassword: "string|min:6",
        confirmPassword: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      const user = await findById(req.user.id);
      if (bcrypt.compareSync(oldPassword, user.password)) {
        if (newPassword === confirmPassword) {
          req.body.password = bcrypt.hashSync(newPassword, 10);
          delete req.body.confirmPassword;
          delete req.body.oldPassword;
          delete req.body.newPassword;
          const user = await update(req.user.id, req.body);
          delete user.password;
          return successResponse(
            res,
            200,
            user,
            "Successfully updated password"
          );
        } else {
          return errorResponse(res, 400, "New password does not match");
        }
      }
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  update: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      req.body.dateOfBirth = moment.utc(req.body.dateOfBirth);
      const user = await update(req.user.id, req.body);
      user.dateOfBirth = moment(user.dateOfBirth).format("YYYY-MM-DD");
      delete user.password;
      return successResponse(res, 200, user, "Successfully updated user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
