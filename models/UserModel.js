const mongoose=require("mongoose");
const moment = require('moment');


const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{type:String,required:true},
    password:{type:String,required:true},
  
})

const User= mongoose.model("User",UserSchema)

module.exports=User