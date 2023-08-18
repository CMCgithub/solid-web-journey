const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true, //
    maxLength: 50,
  },
  email: {
    type: String,
    required: true, //
  },
  password: {
    type: String,
    required: true, //
    minLength: 5,
    maxLength: 8,
  },
  studentID: {
    type: String,
  },
  teacher: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

//
StudentSchema.virtual("url").get(function () {
  return "/detail/student/" + this._id;
});

module.exports = mongoose.model("Student", StudentSchema);
