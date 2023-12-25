
const express = require('express');
const mainRouter=require("./routes/main")
const moment=require("moment");
const postsRouter=require("./routes/posts")
const registerRouter=require("./routes/users")
var exphbs =require("express-handlebars");
const fileUpload=require("express-fileupload")

const app = express();
// Statik dosyaların bulunduğu klasörü belirt
app.use(express.static("public"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const hbs = exphbs.create({
  // diğer yapılandırma seçenekleri...
  // options-to-control-prototype-access belirtilen sayfada bulunan seçenekleri kullanabilirsiniz
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers:{
    generateDate:(date,format)=>{return moment(date).format(format)}
    }
});
app.engine("handlebars",hbs.engine)
app.set("view engine","handlebars")
app.use(fileUpload());
 

app.use(mainRouter)
app.use("/posts",postsRouter)
app.use("/users",registerRouter);

module.exports=app