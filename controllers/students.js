const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Students = require("../../Hostel-Manager/models/Students");

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

exports.checkRegisterNumber = async (req, res) => {
  try {
    const stu = await Student.findOne({
      registerNumber: req.body.registerNumber,
    });
    if (!stu) {
      throw { registerNumber: "Check your register number" };
    }
    res.status(200).json({ success: true, password: stu.password });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
exports.createPassword = async (req, res) => {
  try {
    bcrypt.genSalt(8, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) throw err;
        const stu = await Student.findOneAndUpdate(
          { registerNumber: req.body.registerNumber },
          {
            $set: {
              password: hash,
            },
          },
          { new: true }
        );
        const payload = {
          id: stu.id,
          name: stu.name,
          email: stu.email,
        };
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user: payload,
            });
          }
        );
      });
    });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body;
    const stu = await Student.findOne({
      registerNumber: registerNumber,
    });
    if (!stu) {
      throw { registerNumber: "Student not found" };
    }
    const isMatch = await bcrypt.compare(password, stu.password);
    if (isMatch) {
      const payload = {
        id: stu.id,
        phone: stu.phone,
        name: stu.name,
      };
      jwt.sign(
        payload,
        process.env.SECRET_OR_KEY,
        { expiresIn: 86400 },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            user: payload,
          });
        }
      );
    } else {
      throw "Incorrect Password";
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const newAttendance = new Attendance({
      student: req.user.id,
      date: req.body.date,
      present: true,
    });
    const att = await newAttendance.save();
    res.status(200).json({ success: true, data: att });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.checkAttendance = async (req, res) => {
  try {
    const res = await Attendance.find({
      $and: [{ user: req.user.id }, { date: req.body.date }],
    });
    res.status(200).json({ success: true, data: res });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
