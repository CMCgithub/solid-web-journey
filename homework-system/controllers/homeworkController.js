const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const debug = require("debug")("homework-system:server");
//导入数据库模式
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Homework = require("../models/homework");
const Answer = require("../models/answer");

exports.detail = asyncHandler(async (req, res, next) => {
  var email, isTeacher, student_id,answer;
  jwt.verify(req.session.token, config.secret, (err, decode) => {
    if (err) {
      debug(err);
      req.session = null;
      return res.status(401).render("index", {
        title: "登录状态过期",
      });
    }
    email = decode.email;
    isTeacher = decode.teacher;
  });
  const [homework, numTeachers, numStudents] = await Promise.all([
    Homework.findById(req.params.id)
      .populate("teacher")
      .populate("submitters")
      .exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  if (homework === null) {
    // No results.
    const err = new Error("homework not found");
    err.status = 404;
    return next(err);
  }
  debug("homework" + typeof homework);
  debug(homework.teacher);

  if (!isTeacher) {
    //当前访问用户身份为学生
    var stu = await Student.findOne({ email: email }).exec();
    student_id = stu._id;
    answer = await Answer.findOne({student:student_id,homework:homework._id}).exec();
  }
  res.render("homework_detail", {
    homework: homework,
    isTeacher: isTeacher,
    student_id: student_id,
    answer:answer,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
