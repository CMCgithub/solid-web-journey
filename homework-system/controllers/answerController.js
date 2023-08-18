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
  const [answer, numTeachers, numStudents] = await Promise.all([
    Answer.findOne({
      homework: req.params.homewok_id,
      student: req.params.student_id,
    })
      .populate("student")
      .populate("homework")
      .exec(),
    Teacher.countDocuments({}).exec(),
    Student.countDocuments({}).exec(),
  ]);
  if (answer === null) {
    // No results.
    const err = new Error("answer not found");
    err.status = 404;
    return next(err);
  }
  if (isTeacher) {
    res.render("answer_detail", {
      answer: answer,
      numTeachers: numTeachers,
      numStudents: numStudents,
    });
  } else {
    res.render("index", {
      title: "您没有访问权限",
      numTeachers: numTeachers,
      numStudents: numStudents,
    });
  }
});
exports.submit = [
  body("student_id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("student_id不能为空"),
  body("homework_id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("homework_id不能为空"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("答案不能为空"),
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
      var [answer, numTeachers, numStudents] = await Promise.all([
        Answer.findOne({
          student: req.body.student_id,
          homework: req.body.homework_id,
        }).exec(),
        Teacher.countDocuments({}).exec(),
        Student.countDocuments({}).exec(),
      ]);
      if (answer != null) {
        //该学生已经提交过
        answer.content = req.body.content;
        await answer.save();
        return res.status(200).render("index", {
          title: "答案修改成功！",
          numTeachers: numTeachers,
          numStudents: numStudents,
        });
      } else {
        answer = new Answer({
          content: req.body.content,
          student: req.body.student_id,
          homework: req.body.homework_id,
        });
        ///在作业中添加提交者id
        var homework = await Homework.findById(req.body.homework_id).exec();
        homework.submitters.push(req.body.student_id);//////
        await homework.save();
        await answer.save();
        return res.status(200).render("index", {
          title: "答案提交成功！",
          numTeachers: numTeachers,
          numStudents: numStudents,
        });
      }
    }
  }),
];
