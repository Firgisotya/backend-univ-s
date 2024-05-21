const { errorResponse } = require("../utils/Response");
const { verifyToken } = require("../utils/processToken");

module.exports = {
  authMiddleware: (req, res, next) => { 
    const { authorization } = req.headers;
    if (!authorization) {
      return errorResponse(res, 401, "Unauthorized");
    }
    const token = authorization;
    const payload = verifyToken(token);
    req.user = payload;
    next();
  }
}