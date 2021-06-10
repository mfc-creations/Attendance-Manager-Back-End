const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw { email: "Admin not found" };
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const payload = {
        id: admin.id,
        email: admin.email,
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
      throw { password: "Incorrect Password" };
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      registerNumber: req.body.registerNumber,
    });
    if (student) {
      throw { registerNumber: "Register number already used" };
    }
    const newStu = new Student({
      registerNumber: req.body.registerNumber,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      parentEmail: req.body.parentEmail,
      grade: req.body.grade,
    });
    const stu = await newStu.save();
    res.status(200).json({ success: true, data: stu });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.fetchData = async (req, res) => {
  try {
    const att = await Attendance.find({ date: req.body.date })
      .populate("student")
      .sort({ registerNumber: 1 })
      .lean();
    res.status(200).json({ success: true, data: att });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
