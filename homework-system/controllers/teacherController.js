const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const debug = require("debug")("homework-system:server");
//导入数据库模式
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Homework = require("../models/homework");

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
  const [teacher, numTeachers, numStudents] = await Promise.all([
    Teacher.findOne({ email: email }).exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  if (teacher === null) {
    // No results.
    const err = new Error("User:teacher not found");
    err.status = 404;
    return next(err);
  }
  return res.status(200).render("teacher", {
    teacher: teacher,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.student_list = asyncHandler(async function (req, res, next) {
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
  const [teacher, numTeachers, numStudents] = await Promise.all([
    Teacher.findOne({ email: email }).populate("student").exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  return res.status(200).render("student_list", {
    teacher: teacher,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.homework_list = asyncHandler(async function (req, res, next) {
  var email, isTeacher;
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
  var teacher, numTeachers, numStudents;
  if (isTeacher) {
    [teacher, numTeachers, numStudents] = await Promise.all([
      Teacher.findOne({ email: email }).populate("homework").exec(),
      Teacher.countDocuments({}).exec(),
      Student.countDocuments({}).exec(),
    ]);
  } else {
    [teacher, numTeachers, numStudents] = await Promise.all([
      Teacher.findById(req.params.teacher_id).populate("homework").exec(),
      Teacher.countDocuments({}).exec(),
      Student.countDocuments({}).exec(),
    ]);
  }
  return res.status(200).render("homework_list", {
    isTeacher:isTeacher,
    teacher: teacher,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.assign_homework_get = asyncHandler(async function (req, res, next) {
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
  const [numTeachers, numStudents] = await Promise.all([
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  return res.status(200).render("assign_homework", {
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.assign_homework_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("作业标题不能为空"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("作业内容不能为空"),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug("errors");
      errors.array().forEach(function (item) {
        debug(item);
      });
      next(errors);
    } else {
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
      const [teacher, numTeachers, numStudents] = await Promise.all([
        Teacher.findOne({ email: email }).exec(),
        Teacher.countDocuments({}).exec(),
        Student.countDocuments({}).exec(),
      ]);
      var isExists = await Homework.findOne({ title: req.body.title }).exec();
      if (isExists != null) {
        return res.status(401).render("index", {
          title: "作业标题重复",
        });
      }
      var homework = new Homework({
        title: req.body.title,
        content: req.body.content,
        teacher: teacher._id,
      });
      await homework.save();
      teacher.homework.push(homework);
      await teacher.save();
      res.status(200).render("index", {
        title: "Submitted successfully!",
        numTeachers: numTeachers,
        numStudents: numStudents,
      });
    }
  }),
];
