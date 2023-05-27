const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  // 书本的类别，例如它是小说类还是纪实类，是爱情题材还是军事史题材，等
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

// 虚拟属性'url'：藏书类别 URL
GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

// 导出 GenreS 模型
module.exports = mongoose.model("Genre", GenreSchema);
