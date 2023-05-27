const Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// 显示完整的genre列表
exports.genre_list = asyncHandler(async function (req, res, next) {
  const list_generes = await Genre.find()
    .sort([["name", "ascending"]])
    .exec();
  res.render("genre_list", { title: "Genre List", genere_list: list_generes });
});

// 为每位genre显示详细信息的页面
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// 由 GET 显示创建genre的表单
exports.genre_create_get = asyncHandler(function (req, res, next) {
  res.render("genre_form", { title: "Create Genre" });
});

// 由 POST 处理genre创建操作
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// 由 GET 显示删除genre的表单
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results.
    res.redirect("/catalog/genres");
  }
  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    genre_books: booksInGenre,
  });
});
// 由 POST 处理genre删除操作
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (booksInGenre.length > 0) {
    // Genre has books. Render in same way as for GET route.
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      genre_books: booksInGenre,
    });
  } else {
    // Genre has no books. Delete object and redirect to the list of genres.
    await Genre.findByIdAndRemove(req.body.id);
    res.redirect("/catalog/genres");
  }
});

// 由 GET 显示更新genre的表单
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_form", { title: "Update Genre", genre: genre });
});

// 由 POST 处理genre更新操作
exports.genre_update_post = [
  // Validate the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record.
      await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(genre.url);
    }
  }),
];
