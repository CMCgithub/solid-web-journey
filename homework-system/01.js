// 设置 Mongoose 连接
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://cmc:m8sE8xqaGrcqt57X@homework-systemdb.kdjzkpx.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
