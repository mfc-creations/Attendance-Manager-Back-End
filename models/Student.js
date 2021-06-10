const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Student = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  grade: {
    type: String,
    required: true,
  },
  parentEmail: {
    type: String,
  },
  password: {
    type: String,
  },
});
module.exports = mongoose.model("Students", Student);
