const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  name: {
    type: String,
    required: true,//
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,//
  },
  password: {
    type: String,
    required: true,//
    minLength: 5,
    maxLength: 8,
  },
  personalProfile: { type: String },
  course: { type: String, required: true, minLength: 3, maxLength: 20 },
  student: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  homework: [{ type: Schema.Types.ObjectId, ref: "Homework" }],
});

//
TeacherSchema.virtual("url").get(function () {
  return "/detail/teacher/" + this._id;
});


module.exports = mongoose.model("Teacher", TeacherSchema);
