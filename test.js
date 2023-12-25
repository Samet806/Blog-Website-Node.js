const mongoose=require("mongoose")

const Post=require("./models/PostModel")
const dotenv=require("dotenv")
dotenv.config({path:"./.env"})
mongoose.connect(process.env.URL_STR,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database bağlandı")
}).catch(()=>{
    console.log("Database bağlanmada hata oldu");
})

// Post.findByIdAndUpdate("6589510eab1c918f76837230",{title:"Benim 1. Postum"}).then(data=>{
//     console.log(data);
// })

Post.find().then(data=>{
     console.log(data);
 }).catch(err=>{
    console.log(err);
 })

//  Post.create({
//     title:"ikinci post başlığım",
//     content:"ikinci post içeriği"
// }).then((data)=>{
//     console.log(data);
// }).catch(err=>{
//     console.log(err);
// })