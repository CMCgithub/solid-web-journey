var express = require('express');
var router = express.Router();
var path = require('path');
var verify = require("../controllers/verify");
var teacher_controller = require("../controllers/teacherController");
var student_controller = require("../controllers/studentController");
var homework_controller = require("../controllers/homeworkController");
var answer_controller = require("../controllers/answerController");
/* GET home page. */
router.get('/', verify.verifyToken);
router.get('/teacher',teacher_controller.index);
router.get('/teacher/student_list',teacher_controller.student_list);
router.get('/teacher/homework_list',teacher_controller.homework_list);
router.get('/teacher/assign_homework',teacher_controller.assign_homework_get);
router.post('/teacher/assign_homework',teacher_controller.assign_homework_post);
//student
router.get('/student',student_controller.index);
router.get('/detail/student/:id',student_controller.detail);
router.get('/student/homework_list/:teacher_id',teacher_controller.homework_list);
//homework
router.get("/detail/homework/:id", homework_controller.detail);
//answer
router.post("/answer/submit", answer_controller.submit);
router.get("/answer/:homewok_id/:student_id", answer_controller.detail);
module.exports = router;
