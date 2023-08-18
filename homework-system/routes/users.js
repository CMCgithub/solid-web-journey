var express = require('express');
var router = express.Router();
var login_controller = require("../controllers/loginController");

/* GET users listing. */
router.get('/signin', login_controller.signin_get);
router.post('/signin',login_controller.signin_post);
router.get('/signup', login_controller.signup_get);
router.post('/signup', login_controller.signup_post);
router.get('/signout', login_controller.signout);
router.post('/code', login_controller.code);//处理验证码请求
module.exports = router;
