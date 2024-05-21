module.exports = {
  successResponse: (res, status, data, message) => {
    return res.status(status).json({
      ...(message && { message }),
      ...(data && { data }),
    });
  },

  errorResponse: (res, status = 400, message) => {
    return res.status(status).json({
      ...(message && { message }),
    });
  },
};
