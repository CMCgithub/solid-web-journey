const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // 用户登录名和密码
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 8,
  }
});

// 导出模型
module.exports = mongoose.model("User", UserSchema);
