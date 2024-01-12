const mongoose=require("mongoose");
const app=require("./app")
const dotenv=require("dotenv")
dotenv.config({path:"./.env"});
const port = 3000;
const serverless=require("serverless-http")

mongoose.connect(process.env.MONGO_URL,{
    dbName:"blog",
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database bağlandı")
}).catch((err)=>{
    console.log("Database bağlanmada hata oldu"+err);
})



// Sunucuyu dinlemeye başla
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });



