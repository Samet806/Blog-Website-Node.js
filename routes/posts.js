const express = require("express");
const Post = require("../models/PostModel");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");
const Category = require("../models/categoryModel");
const User = require("../models/UserModel");

router.get("/new", (req, res) => {
  // public/blog.html sayfasına yönlendir
  Category.find({}).then(categories=>{
    res.render("site/addpost",{categories:categories});
  })


  
});

router.get("/:id", async (req, res) => {
  // public/blog.html sayfasına yönlendir
  await Post.findById(req.params.id).populate({path:"author",model:User}).then((post) => {
    Category.find({}).then(categories=>{
      res.render("site/post", { post: post,categories:categories });
    })

  });
});

router.post("/test", async (req, res) => {
  const { title, content } = req.body;
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );

   const post =await Post.create({ ...req.body, post_image: `/img/postimages/${post_image.name}`,author:req.session.userId })
 
  req.session.sessionFlash = {
    type: "alert alert-success",
    message: "Postunuz başarılı bir şekilde eklendi",
  };

  res.redirect("/blog");
});

module.exports = router;
