const Validator = require("fastest-validator");
const { errorResponse } = require("../utils/Response");
const v = new Validator();
module.exports = {
  requestValidation: (res, request, schema) => {
    const validate = v.validate(request, schema);
    if (validate.length) {
      return errorResponse(res, 400, validate);
    }
  },
};
