const express = require("express");
const Post = require("../models/PostModel");
const Category = require("../models/categoryModel");
const User = require("../models/UserModel");
const router = express.Router();

router.get("/", (req, res) => {

  res.render("site/index");
});

router.get("/blog", (req, res) => {
  const postPerPage = 4;
  const page = req.query.page || 1;

  Post.find({})
    .populate({ path: "author", model: User })
    .sort({ _id: -1 })

    .skip(postPerPage * page - postPerPage)
    .limit(postPerPage)
    .then((posts) => {
      Post.countDocuments().then((postCount) => {
        Category.aggregate([
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "category",
              as: "posts",
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              num_of_posts: { $size: "$posts" },
            },
          },
        ])
          .sort({ _id: -1 })
          .then((categories) => {
            res.render("site/blog", {
              categories: [...categories],
              posts: [...posts],
              allPosts:posts,
              current: parseInt(page),
              pages: Math.ceil(postCount / postPerPage),
            });
          });
      });
    });
});

router.get("/contact", (req, res) => {
  res.render("site/contact");
});

module.exports = router;
