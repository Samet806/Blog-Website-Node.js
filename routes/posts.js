const express = require("express");
const Post = require("../models/PostModel");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");
const Category = require("../models/categoryModel");
const User = require("../models/UserModel");

router.get("/new", (req, res) => {
  Category.find({}).then((categories) => {
    res.render("site/addpost", { categories: categories });
  });
});

//search butonu
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/look", function (req, res) {
  if (req.query.look) {
    const regex = new RegExp(escapeRegex(req.query.look), "gi");
    Post.find({ title: regex })
      .populate({ path: "author", model: User })
      .sort({ _id: -1 })
      .then((posts) => {
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
        ]).then((categories) => {
          res.render("site/blog", { posts: posts, categories: categories });
        });
      });
  }
});

router.get("/category/:categoryId", (req, res) => {
  Post.find({ category: req.params.categoryId })
    .populate({ path: "category", model: Category })
    .populate({ path: "author", model: User })
    .then((posts) => {
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
      ]).then((categories) => {
        res.render("site/blog", { posts: posts, categories: categories });
      });
    });
});

router.get("/:id", async (req, res) => {
  await Post.findById(req.params.id)
    .populate({ path: "author", model: User })
    .then((post) => {
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
      ]).then((categories) => {
        Post.find({})
          .populate({ path: "author", model: User })
          .sort({ _id: -1 })
          .then((posts) => {
            res.render("site/post", {
              post: post,
              categories: categories,
              posts: posts,
            });
          });
      });
    });
});

router.post("/test", async (req, res) => {
  const { title, content } = req.body;
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );

  const post = await Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
    author: req.session.userId,
  });

  req.session.sessionFlash = {
    type: "alert alert-success",
    message: "Postunuz başarılı bir şekilde eklendi",
  };

  res.redirect("/blog");
});

module.exports = router;
