const express=require("express");
const Post=require("../models/PostModel")
const router=express.Router();
const path=require("path")


        router.get('/new', (req, res) => {
            // public/blog.html sayfasına yönlendir
            res.render("site/addpost");  });

            
        router.get('/:id', async (req, res) => {
            // public/blog.html sayfasına yönlendir
           await Post.findById(req.params.id).then(post=>{
                res.render("site/post",{post:post});
            })
             });

            
        router.post('/test', (req, res) => {
           const {title,content}=req.body;
           let post_image=req.files.post_image;
           post_image.mv(path.resolve(__dirname,"../public/img/postimages",post_image.name))
           Post.create({...req.body,
            post_image:`/img/postimages/${post_image.name}`}).then(data=>{
            console.log(data)
           }).catch(err=>{
            console.log(err); 
           })
         
            res.redirect("/")
        })

  
    
 module.exports=router
