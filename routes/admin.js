const express = require("express");
const router = express.Router();
const passport = require("passport");
const { addStudent, loginAdmin, fetchData } = require("../controllers/admin");

router.route("/login").post(loginAdmin);
router
  .route("/addstudent")
  .post(passport.authenticate("admin", { session: false }), addStudent);
router
  .route("/fetchdata")
  .post(passport.authenticate("admin", { session: false }), fetchData);

module.exports = router;
