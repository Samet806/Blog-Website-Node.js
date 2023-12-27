const express = require("express");
const Category=require("../models/categoryModel")


const router = express.Router();

router.get("/",(req,res)=>{
    res.render("admin/index");
})

router.get("/categories", async (req,res)=>{

    const categories=await Category.find({}).sort({_id:-1})
    res.render("admin/categories",{categories:categories});

    // .then((categories)=>{
    //     res.render("admin/categories",{categories:categories});
    // })
    
})

router.post("/categories",async (req,res)=>
{ 
try{
    const {name}=req.body;
    const category= await Category.create({name});

    res.redirect("/admin/categories");
}
catch(err)
{
  console.log("Error:"+err.message);
}

})

router.delete("/categories/:id",(req,res)=>{

    Category.deleteOne({_id:req.params.id}).then(()=>{
        res.redirect("/admin/categories");
    })
    
})



module.exports=router