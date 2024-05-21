var express = require("express");
var router = express.Router();
const ReminderController = require("../controllers/reminder.controller");

router.get("/", ReminderController.index);
router
  .route("/:id")
  .get(ReminderController.show)
  .delete(ReminderController.destroy);
router.post("/", ReminderController.store);

module.exports = router;
