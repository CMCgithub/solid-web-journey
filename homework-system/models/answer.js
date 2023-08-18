const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true, //
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  homework: {
    type: Schema.Types.ObjectId,
    ref: "Homework",
    required: true,
  },
});

//
AnswerSchema.virtual("url").get(function () {
  return "/detail/answer/" + this._id;
});

module.exports = mongoose.model("Answer", AnswerSchema);
