const express = require("express");
const Category = require("../models/categoryModel");
const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

//Categories

router.get("/categories", async (req, res) => {
  const categories = await Category.find({}).sort({ _id: -1 });
  res.render("admin/categories", { categories: categories });
});

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });

    res.redirect("/admin/categories");
  } catch (err) {
    console.log("Error:" + err.message);
  }
});

router.delete("/categories/:id", (req, res) => {
  Category.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/admin/categories");
  });
});

//POSTS

router.get("/posts", (req, res) => {
  Post.find({})
    .populate({ path: "category", model: Category })
    .sort({ _id: -1 })
    .then((posts) => {
      res.render("admin/posts", { posts: [...posts] });
    });
});
//category edit
router.get("/category/edit/:id", (req, res) => {
  Category.findById(req.params.id).then((category) => {
    res.render("admin/editCategory", { category: category });
  });
});

router.put("/category/:id", (req, res) => {
  Category.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  ).then((category) => {
    res.redirect("/admin/categories");
  });
});

router.delete("/posts/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/admin/posts");
  });
});

//Posts edit

router.get("/posts/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    Category.find({}).then((categories) => {
      res.render("admin/editpost", { post: post, categories: categories });
    });
  });
});

router.put("/posts/:id", (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );
  Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, post_image: `/img/postimages/${post_image.name}` },
    { new: true }
  ).then((post) => {
    res.redirect("/admin/posts");
  });
});

module.exports = router;
