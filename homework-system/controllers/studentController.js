const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const debug = require("debug")("homework-system:server");
//导入数据库模式
const Teacher = require("../models/teacher");
const Student = require("../models/student");

exports.index = asyncHandler(async function (req, res, next) {
  var email;
  jwt.verify(req.session.token, config.secret, (err, decode) => {
    if (err) {
      debug(err);
      req.session = null;
      return res.status(401).render("index", {
        title: "登录状态过期",
      });
    }
    email = decode.email;
  });
  const [student, numTeachers, numStudents] = await Promise.all([
    Student.findOne({ email: email }).populate('teacher').exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  if (student === null) {
    // No results.
    const err = new Error("User:student not found");
    err.status = 404;
    return next(err);
  }
  return res.status(200).render("student", {
    student: student,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.detail = asyncHandler(async function (req, res, next) {
  jwt.verify(req.session.token, config.secret, (err, decode) => {
      if(err){
        debug(err);
        req.session = null;
        return res.status(401).render("index", {
          title: "登录状态过期",
        });
      }
    });
    const [student, numTeachers, numStudents] = await Promise.all([
      Student.findById(req.params.id)
        .populate("teacher")
        .exec(),
      Teacher.countDocuments({}).exec(),
      Student.countDocuments({}).exec(),
    ]);
    if (student === null) {
      // No results.
      const err = new Error("student not found");
      err.status = 404;
      return next(err);
    }
    res.render("student_detail", {
      student: student,
      numTeachers: numTeachers,
      numStudents: numStudents,
    });
});