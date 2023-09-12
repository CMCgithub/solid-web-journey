### 开发环境：[VSCEODE](https://code.visualstudio.com/Download)、[node](https://nodejs.org/zh-cn/)、[npm](https://docs.npmjs.com/)
### 运行环境：powershell/bash
### 框架和库：
> 1. 框架：express
> 2. 用到的包（通过npm安装到项目）：
   >> - express-generator:*快速构建express项目*
   >> - cookie-parser:*cookie的设置与解析* 
   >> - cookie-session:*实现会话存储功能、设置会话加密秘钥*
   >> - debug: *调试模式下打印错误信息*
   >> - express
   >> - express-async-handler:*处理异步快速路由内的异常并将它们传递给快速错误处里程序的简单中间件*
   >> - express-validator:*验证请求的body，配置验证规则*
   >> - http-errors:*构建error，可以通过error.message error.name error.stack分别获得错误的信息，名称，还有栈*
   >> - jade:*HTML模板引擎*
   >> - jsonwebtoken:*生成具有头部、载荷和签名的JWT*
   >> - mongoose:*连接Mongdb*
   >> - morgan:*服务器响应日志*
   >> - nodemailer:*发送邮件*
   >> - nodemon:*监控源代码自动重启服务器，协助开发*
### 数据库以及创建：
#### 使用mLab免费版云数据库，创建步骤如下：
1. 首先 用 [mLab](https://www.mongodb.com/zh-cn) 创建一个账户
2. 点击创建新的MongoDB数据库，选择免费版以及合适的云服务提供商，为数据库命名并创建user，得到一个可访问的数据库URL
3. 在项目中安装`npm install mongoose
`并在app.js中连接数据库，如下代码所示：
```
// 设置 Mongoose 连接
const mongoose = require("mongoose");
const mongoDB = "在此插入数据库_URL";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 连接错误："));
```
### 环境搭建：
#### 到官网安装node(https://nodejs.org/zh-cn/)、npm(https://docs.npmjs.com/)

### 系统运行简单说明：
1. 确保已安装node和npm,在终端（或命令行）中运行 "version" 命令:
```
>node -v
v16.17.0

npm -v
9.8.1
```
2. 在项目根目录下运行`npm install`安装项目依赖
3. 运行`npm run devstart`对项目进行调试运行
