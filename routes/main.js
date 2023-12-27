const express = require("express");
const Post = require("../models/PostModel");
const Category=require("../models/categoryModel");
const User = require("../models/UserModel");
const router = express.Router();

router.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname,"site/index.html"))   express handlebars kullanmadan önce bu şekilde yapıyorduk
  // public/index.html sayfasına yönlendir

  res.render("site/index");
});



router.get("/blog", (req, res) => {
  // public/blog.html sayfasına yönlendir
  Post.find({}).populate({path:"author",model:User}).sort({_id:-1}).then((posts) => {
    Category.find({}).sort({_id:-1}).then((categories)=>{
       
      res.render("site/blog", { categories: [...categories], posts:[...posts]   });
    
    })
  
  });
});

router.get("/contact", (req, res) => {
  // public/blog.html sayfasına yönlendir
  res.render("site/contact");
});

module.exports = router;
