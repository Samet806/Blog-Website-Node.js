const jwt=require("jsonwebtoken")
const User=require("../models/UserModel")

exports.tokenCheck= async (req,res,next)=>{
 const headersToken=req.headers.authorization && req.headers.authorization.startsWith("bearer");
 if(!headersToken)
 {
    console.log("geçersiz token");
 }
 const token=req.headers.authorization.split(" ")[1];
 await jwt.verify(token,process.env.JWT_KEY, async (err,decoded)=>{
    if(err)
    {
        console.log("geçersiz token");
    }
    const userInfo=await User.findById(decoded.sub).select("_id username ");
    if(!userInfo)
    {
        console.log("geçersiz token");
    }
    req.user = decoded;
    next();
 })



}