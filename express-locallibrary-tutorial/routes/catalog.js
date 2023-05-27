const express = require("express");
const router = express.Router();
const verify = require("./verify");
// 导入控制器模块
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

/// 藏书路由 *******************///

// GET 获取藏书编目主页
router.get("/", [verify.verifyToken, book_controller.index]);

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get("/book/create", [
  verify.verifyToken,
  book_controller.book_create_get,
]);
router.post("/book/create", [
  verify.verifyToken,
  book_controller.book_create_post,
]);
router.get("/book/:id/delete", [
  verify.verifyToken,
  book_controller.book_delete_get,
]);
router.post("/book/:id/delete", [
  verify.verifyToken,
  book_controller.book_delete_post,
]);
router.get("/book/:id/update", [
  verify.verifyToken,
  book_controller.book_update_get,
]);
router.post("/book/:id/update", [
  verify.verifyToken,
  book_controller.book_update_post,
]);
router.get("/book/:id", [verify.verifyToken, book_controller.book_detail]);
router.get("/books", [verify.verifyToken, book_controller.book_list]);

/// 藏书副本 *******************///
router.get("/bookinstances", [
  verify.verifyToken,
  book_instance_controller.bookinstance_list,
]);
router.get("/bookinstance/create", [
  verify.verifyToken,
  book_instance_controller.bookinstance_create_get,
]);
router.post("/bookinstance/create", [
  verify.verifyToken,
  book_instance_controller.bookinstance_create_post,
]);
router.get("/bookinstance/:id/delete", [
  verify.verifyToken,
  book_instance_controller.bookinstance_delete_get,
]);
router.post("/bookinstance/:id/delete", [
  verify.verifyToken,
  book_instance_controller.bookinstance_delete_post,
]);
router.get("/bookinstance/:id/update", [
  verify.verifyToken,
  book_instance_controller.bookinstance_update_get,
]);
router.post("/bookinstance/:id/update", [
  verify.verifyToken,
  book_instance_controller.bookinstance_update_post,
]);
router.get("/bookinstance/:id", [
  verify.verifyToken,
  book_instance_controller.bookinstance_detail,
]);
/// 藏书种类 *******************///
router.get("/genres", [verify.verifyToken, genre_controller.genre_list]);
router.get("/genre/create", [
  verify.verifyToken,
  genre_controller.genre_create_get,
]); //注意此项必须位于路由使用了 :id之前
router.post("/genre/create", [
  verify.verifyToken,
  genre_controller.genre_create_post,
]);
router.get("/genre/:id/delete", [
  verify.verifyToken,
  genre_controller.genre_delete_get,
]);
router.post("/genre/:id/delete", [
  verify.verifyToken,
  genre_controller.genre_delete_post,
]);
router.get("/genre/:id/update", [
  verify.verifyToken,
  genre_controller.genre_update_get,
]);
router.post("/genre/:id/update", [
  verify.verifyToken,
  genre_controller.genre_update_post,
]);
router.get("/genre/:id", [verify.verifyToken, genre_controller.genre_detail]);

/// 作者的路由 *******************///
router.get("/authors", [verify.verifyToken, author_controller.author_list]);
router.get("/author/create", [
  verify.verifyToken,
  author_controller.author_create_get,
]); //注意此项必须位于路由使用了 :id之前
router.post("/author/create", [
  verify.verifyToken,
  author_controller.author_create_post,
]);
router.get("/author/:id/delete", [
  verify.verifyToken,
  author_controller.author_delete_get,
]);
router.post("/author/:id/delete", [
  verify.verifyToken,
  author_controller.author_delete_post,
]);
router.get("/author/:id/update", [
  verify.verifyToken,
  author_controller.author_update_get,
]);
router.post("/author/:id/update", [
  verify.verifyToken,
  author_controller.author_update_post,
]);
router.get("/author/:id", [
  verify.verifyToken,
  author_controller.author_detail,
]);
module.exports = router;
