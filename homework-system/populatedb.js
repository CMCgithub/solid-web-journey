#! /usr/bin/env node

console.log(
  'This script populates some test student, homework, answer and teacher to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
var config = require("./config/config");
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Answer = require("./models/answer");
const Homework = require("./models/homework");
const Student = require("./models/student");
const Teacher = require("./models/teacher");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
console.log("MongonDB url:"+mongoDB);
main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(config.mongoDB);
  console.log("Debug: Should be connected?");
  // await teacherCreate();
  // await studentCreate();
  await homeworkCreate();
  await answerCreate();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
// var teacher;
// var student;
// async function teacherCreate() {
//   teacher = new Teacher({ name: "教师1",email:"123@qq.com",password:"123456" ,course:"数据库"});
//   await teacher.save();
// }
// async function studentCreate() {
//   student = new Student({ name: "学生1",email:"233@qq.com",password:"123456" ,studentID:'11111',teacher:[teacher]});
//   await student.save();
// }
var homework;
var answer;
async function homeworkCreate() {
  homework = new Homework({ title: "作业1",content:"作业1内容",teacher:"64a9846f524ab122d10d40fd"});
  await homework.save();
}
async function answerCreate() {
  answer = new Answer({ content: "答案1",homework:homework,student:"64a9846f524ab122d10d40ff"});
  await answer.save();
}

