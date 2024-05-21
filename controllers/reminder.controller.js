const { successResponse, errorResponse } = require("../utils/Response");
const {
  findAll,
  findById,
  update,
  store,
  destroy,
} = require("../services/reminder.service");

const { requestValidation } = require("../utils/RequestValidation");
const { verifyToken } = require("../utils/processToken");
const moment = require("moment");
module.exports = {
  index: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      let reminders = await findAll(req.user.id);
      reminders = reminders.map((reminder) => {
        return {
          ...reminder,
          time: moment.utc(reminder.time).format("HH:mm"),
          date: moment.utc(reminder.date).format("YYYY-MM-DD"),
        };
      });
      return successResponse(
        res,
        200,
        reminders,
        "Successfully retrieved all reminders"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      req.body.date = moment.utc(req.body.date, "YYYY-MM-DD");
      req.body.time = moment.utc(req.body.time, "HH:mm");
      const reminder = await store(req.body);
      return successResponse(
        res,
        200,
        reminder,
        "Successfully created reminder"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const reminder = await findById(id);
      if (reminder) {
        reminder.time = moment.utc(reminder.time).format("HH:mm");
        reminder.date = moment.utc(reminder.date).format("YYYY-MM-DD");
        return successResponse(
          res,
          200,
          reminder,
          "Successfully retrieved reminder"
        );
      }
      return errorResponse(res, 404, "Reminder not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const reminder = await findById(id);
      if (reminder) {
        await destroy(id);
        return successResponse(res, 200, "Successfully deleted reminder");
      }
      return errorResponse(res, 404, "Reminder not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
