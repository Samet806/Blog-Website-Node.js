const express = require("express");
const Post = require("../models/PostModel");
const router = express.Router();

router.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname,"site/index.html"))   express handlebars kullanmadan önce bu şekilde yapıyorduk
  // public/index.html sayfasına yönlendir
  console.log(req.session);
  res.render("site/index");
});

router.get("/about", (req, res) => {
  // public/about.html sayfasına yönlendir
  res.render("site/about");
});

router.get("/blog", (req, res) => {
  // public/blog.html sayfasına yönlendir
  Post.find({}).then((posts) => {
    res.render("site/blog", { posts: posts });
  });
});

router.get("/contact", (req, res) => {
  // public/blog.html sayfasına yönlendir
  res.render("site/contact");
});

module.exports = router;
