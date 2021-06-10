const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Attendance = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Students",
  },
  date: {
    type: String,
  },
  present: {
    type: Boolean,
  },
});
module.exports = mongoose.model("Attendances", Attendance);
