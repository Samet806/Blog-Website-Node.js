const mongoose=require("mongoose");
const moment = require('moment');


const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{type:String,required:true},
    date:{type:Date,default:Date.now},
    post_image:{
        type:String,
        required:true,
    },
})

const Post= mongoose.model("Post",PostSchema)

module.exports=Post