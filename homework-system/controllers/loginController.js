const Teacher = require("../models/teacher");
const Student = require("../models/student");
const config = require("../config/config.js");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const path = require("path");
const debug = require("debug")("homework-system:server");
// 导入nodemailer
const nodemailer = require("nodemailer");

exports.signin_get = function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
};
exports.signup_get = function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "register.html"));
};
exports.signup_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("用户名不能为空"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("邮箱不能为空")
    .isEmail()
    .withMessage("请填写正确的邮箱格式"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("密码为5-8位"),
  body("repeatpassword")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("重复密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("重复密码为5-8位"),
  body("code")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("验证码不能为空")
    .isNumeric()
    .withMessage("验证码为6位数字"),
  body("identity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("身份不能为空"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors");
      errors.array().forEach(function (item) {
        console.log(item);
      });
      return res.status(401).redirect("/users/signup");
    } else {
      var user,isUserExists;
      if (req.body.identity == "teacher") {
        user = new Teacher({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        isUserExists = await Teacher.findOne({ email: req.body.email }).exec();
      } else {
        user = new Student({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        isUserExists = await Student.findOne({ email: req.body.email }).exec();
      }
      if (isUserExists != null) {
        //该邮箱已注册
        return res.status(401).render("index", {
          title: "邮箱已注册",
        });
      }
      if (req.body.password != req.body.repeatpassword) {
        return res.status(401).render("index", {
          title: "两次密码不同",
        });
      }
      //验证码
      var token = req.session.token;
      if (!token) {
        debug("token is null");
        return res.status(401).render("index", {
          title: "验证码无效",
        });
      }
      jwt.verify(token, config.secret, (err, decode) => {
        if(err){
          debug(err);
          req.session = null;
          return res.status(401).render("index", {
            title: "验证码无效",
          });
        }
        debug("d-email: "+decode.email+"\nd-code: "+decode.code);
        if(req.body.email != decode.email || req.body.code != decode.code){
          return res.status(401).render("index", { title: "验证码错误" });
        }
      });
      await user.save();
      res.render("index", { title: "User registered successfully!" });
    }
  }),
];

exports.signin_post = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("邮箱不能为空")
    .isEmail()
    .withMessage("请填写正确的邮箱格式"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("密码不能为空")
    .isLength({ min: 5, max: 8 })
    .withMessage("密码为5-8位"),
  body("identity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("身份不能为空"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug("errors");
      errors.array().forEach(function (item) {
        debug(item);
      });
      res.sendFile(path.join(__dirname, "../public", "login.html"));
      return;
    } else {
      //格式正确，查找数据库是否存在该用户
      var user;
      var teacher = false;
      if (req.body.identity == "teacher") {
        teacher = true;
        user = await Teacher.findOne({ email: req.body.email }).exec();
      } else {
        user = await Student.findOne({ email: req.body.email }).exec();
      }
      debug("user: " + user);
      if (user)
        debug(
          "当前登录用户: " + user.name + "  数据库中密码：" + user.password
        );
      if (!user) {
        return res.status(404).render("index", { title: "User Not found." });
      }
      if (user.password != req.body.password) {
        return res.status(401).render("index", { title: "Invalid Password!" });
      }
      //记录登录用户邮箱、身份
      const token = jwt.sign({ email: user.email, teacher:teacher}, config.secret, {
        expiresIn: "1h", // 1 hours
      });
      req.session.token = token;
      return res.status(200).redirect('/');
    }
  }),
];

exports.signout = asyncHandler(async (req, res) => {
  try {
    req.session = null;
    return res.status(200).render("index", {
      title: "You've been signed out!",
    });
  } catch (err) {
    next(err);
  }
});
exports.code = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("邮箱不能为空")
    .isEmail()
    .withMessage("请填写正确的邮箱格式"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors");
      errors.array().forEach(function (item) {
        console.log(item);
      });
      return res.status(200).render("index", {
        title: "未填写邮箱地址或地址格式错误",
      });
    } else {
      var code = Geneatecode(); //生成6位数验证码
      //发送邮件
      await sendEmail(req.body.email, code);
      var payload = { email: req.body.email, code: code };
      const token = jwt.sign(payload, config.secret, {
        expiresIn: "10m", // 10 min
      });
      req.session.token = token; //用token加密保存到用户session
      return res.status(200).render("index", {
        title:
          "邮箱: " +
          req.body.name +
          "\n验证码: " +
          code +
          "\n身份： " +
          req.body.identity,
      });
    }
  }),
];
function Geneatecode() {
  //如生成3位的随机数就定义100-999；
  //const max = 100;
  //const min = 999;
  //生成6位的随机数就定义100000-999999之间
  const min = 100000; //最小值
  const max = 999999; //最大值
  const range = max - min; //取值范围差
  const random = Math.random(); //小于1的随机数
  const result = min + Math.round(random * range); //最小数加随机数*范围差
  debug("生成的随机数：" + result);
  return result;
}
/**
 * 发送邮件
 * @param {type:Email, Default:none} toEmail  给谁发送邮件的邮箱
 * @param {type:String|NUmber,, Default:none} code 发送的验证码
 * @param {type:String , Default:'smtp.qq.com'} host   邮箱服务的host
 */
async function sendEmail(toEmail, code, host = "smtp.163.com") {
  let transporter = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
      user: "cmc233333@163.com", // 发送邮件的邮箱
      pass: config.pass, // 邮箱的授权码
    },
    tls: {
      rejectUnauthorized: false, // 拒绝认证就行了， 不然会报证书问题
    },
  });

  let mailOptions = {
    from: "来自 作业系统< cmc233333@163.com >", // sender address
    to: toEmail, // list of receivers
    subject: "验证码", // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html:
      "你的验证码为<b style='color:skybkue;'>" +
      code +
      "</b>,10分钟内有效，请务透漏给他人！",
    //  // 发送邮箱附件
    //  attachments: [{
    //     // 文件名
    //     filename: 'server.js',
    //     // 文件路径
    //     path: './server.js'
    // }]
  };
  await transporter.sendMail(mailOptions);
}
