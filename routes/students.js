const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  login,
  checkRegisterNumber,
  createPassword,
  markAttendance,
  checkAttendance,
} = require("../controllers/students");

router.route("/login").post(login);
router.route("/checkregisternumber").post(checkRegisterNumber);
router.route("/createpassword").post(createPassword);
router
  .route("/markattendance")
  .post(passport.authenticate("student", { session: false }), markAttendance);
router
  .route("/checkattendance")
  .post(passport.authenticate("student", { session: false }), checkAttendance);

module.exports = router;
