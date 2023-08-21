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
    isTeacher:true,
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
    isTeacher: isTeacher,
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
exports.manage_student = asyncHandler(async function (req, res, next) {
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
  var [students, teacher, numTeachers, numStudents] = await Promise.all([
    Student.find().populate("teacher").exec(),
    Teacher.findOne({ email: email }).exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  return res.status(200).render("manage_student", {
    students: students,
    teacher: teacher,
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.delete_student = asyncHandler(async function (req, res, next) {
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
  var [student, teacher, numTeachers, numStudents] = await Promise.all([
    Student.findById(req.params.student_id).exec(),
    Teacher.findOne({ email: email }).exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  for (var i = 0; i < teacher.student.length; i++) {
    if (teacher.student[i].toHexString() == req.params.student_id) {
      teacher.student.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < student.teacher.length; i++) {
    if (student.teacher[i].toHexString() == teacher._id.toHexString()) {
      student.teacher.splice(i, 1);
      i--;
    }
  }
  // /////
  // 删除教师作业submitters和答案对中的学生
  // ////
  await teacher.save();
  await student.save();
  return res.status(200).render("index", {
    title: "学生已删除",
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
exports.add_student = asyncHandler(async function (req, res, next) {
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
  var [student, teacher, numTeachers, numStudents] = await Promise.all([
    Student.findById(req.params.student_id).exec(),
    Teacher.findOne({ email: email }).exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  teacher.student.push(student);
  student.teacher.push(teacher);
  await teacher.save();
  await student.save();
  return res.status(200).render("index", {
    title: "学生已添加",
    numTeachers: numTeachers,
    numStudents: numStudents,
  });
});
