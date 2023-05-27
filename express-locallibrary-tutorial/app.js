var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
var logger = require("morgan");
var compression = require("compression");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var catalogRouter = require("./routes/catalog");
var verify = require("./routes/verify");

var app = express();
// 设置 Mongoose 连接
const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://3350322722:4wSxEHEtbio1eJki@local-library.2vi3hec.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 连接错误："));
/*************
const Author = require("./models/author");
Author.find().exec().then((res)=>{console.log(res);});
/************/
//console.log(app.get('env'));development
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json()); //解析传入的 JSON 请求并将解析的数据放入 req.body。
app.use(express.urlencoded({ extended: false })); //解析URL-encoded格式的请求体数据
app.use(cookieParser());
app.use(cookieSession({ keys: ["aaa", "bbb", "ccc"] }));
app.use(compression()); //使用的压缩方法,如果不支持压缩方法，则响应将以未压缩的方式发送

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // 将 catalog 路由添加进中间件链

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //console.log("catch 404 and forward to error handler");
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "error" });
});

module.exports = app;
