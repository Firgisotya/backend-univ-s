const { successResponse, errorResponse } = require("../utils/Response");
const bcrypt = require("bcryptjs");
const {
  findById,
  store,
  findByEmail,
  findByUsername,
  update,
} = require("../services/user.service");

const { otpMail } = require("../services/mail");

const { requestValidation } = require("../utils/RequestValidation");
const { generateToken, verifyToken } = require("../utils/processToken");
const moment = require("moment");
module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false|email",
        username: "string|empty:false",
        dateOfBirth: "string|empty:false",
        password: "string|min:6",
        password_confirmation: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      if (req.body.password !== req.body.password_confirmation) {
        return errorResponse(res, 400, "Password does not match");
      }
      const emailFound = await findByEmail(req.body.email);
      if (emailFound) {
        return errorResponse(res, 409, "Email already in use");
      }
      const usernameFound = await findByUsername(req.body.username);
      if (usernameFound) {
        return errorResponse(res, 409, "Username already in use");
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      delete req.body.password_confirmation;
      req.body.dateOfBirth = moment.utc(req.body.dateOfBirth);
      const user = await store(req.body);
      return successResponse(res, 201, user, "Successfully created user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const schema = {
        email: "email|empty:false|email",
        password: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      const userFound = await findByEmail(email);
      if (userFound) {
        if (bcrypt.compareSync(password, userFound.password)) {
          const data = {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          };
          const token = generateToken(data);
          const payload = verifyToken(token);
          return successResponse(
            res,
            200,
            { payload, token },
            "Login successful"
          );
        } else {
          return errorResponse(res, 400, "Invalid credentials");
        }
      } else {
        return errorResponse(res, 400, "Invalid credentials");
      }
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  getAuth: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const user = await findById(req.user.id);
      delete user.password;
      return successResponse(res, 200, user, "Successfully retrieved user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  sendMail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) { 
        return errorResponse(res, 400, "Email is required");
      }

      const user = await findByEmail(email);

      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      // otp berisi 4 angka
      const otp = Math.floor(Math.random() * 9999);

      await update(user.id, { otp });

      await otpMail(email, { name: user.name, otp });

      return successResponse(res, 200, [], "Successfully retrieved user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, otp, password, password_confirmation } = req.body;
      const schema = {
        email: "email|empty:false|email",
        otp: "number",
        password: "string|min:6",
        password_confirmation: "string|min:6",
      };

      requestValidation(res, req.body, schema);
      if (password !== password_confirmation) {
        return errorResponse(res, 400, "Password does not match");
      }

      const user = await findByEmail(email);
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }
      if (user.otp !== otp) {
        return errorResponse(res, 400, "Invalid OTP");
      }

      req.body.password = bcrypt.hashSync(password, 10);
      user.otp = null;
      await update(user.id, {
        password: req.body.password,
        otp: null,
      });

      return successResponse(res, 200, [], "Successfully reset password");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
