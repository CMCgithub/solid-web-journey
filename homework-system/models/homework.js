const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HomeworkSchema = new Schema({
  title: {
    type: String,
    required: true, //
    maxLength: 50,
  },
  content: {
    type: String,
    required: true, //
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,//
  },
  submitters: [//已完成学生
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

//
HomeworkSchema.virtual("url").get(function () {
  return "/detail/homework/" + this._id;
});

module.exports = mongoose.model("Homework", HomeworkSchema);
