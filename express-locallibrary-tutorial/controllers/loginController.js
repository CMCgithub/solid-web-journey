const User = require("../models/user");
const config = require("../config/config.js");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
exports.signin_get = function (req, res, next) {
  res.render("login", { title: "sign in" });
};
exports.signup_get = function (req, res, next) {
  res.render("login", { title: "sign up" });
};
exports.signup_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("用户名不能为空")
    .isEmail()
    .withMessage("请填写正确的邮箱格式"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("密码为5-8位"),
  body("ack_password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("ack密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("ack密码为5-8位"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      name: req.body.name,
      password: req.body.password,
    });
    if (!errors.isEmpty()) {
      res.render("login", {
        title: "sign up",
        errors: errors.array(),
      });
      return;
    } else {
      const username = await User.findOne({ name: req.body.name }).exec();
      if (username != null) {
        return res.status(401).send({
          message: "邮箱已注册",
        });
      }
      if (req.body.password != req.body.ack_password) {
        return res.status(401).send({
          message: "密码错误",
        });
      }
      await user.save();
      res.send({ message: "User registered successfully!" });
    }
  }),
];

exports.signin_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("用户名不能为空")
    .isEmail()
    .withMessage("请填写正确的邮箱格式"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("密码为5-8位"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", {
        title: "sign in",
        errors: errors.array(),
      });
      return;
    } else {
      //格式正确，查找数据库是否存在该用户
      const user = await User.findOne(
        { name: req.body.name }
      ).exec();
      //console.log("user: " + user);
      //console.log("当前登录用户id: " + user._id + "数据库中密码：" + user.password);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      if (user.password != req.body.password) {
        return res.status(401).send({
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: "1h", // 1 hours
      });
      req.session.token = token;
      return res.status(200).send({
        message: "Hi, " + req.body.name,
      });
    }
  }),
];

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    next(err);
  }
};
