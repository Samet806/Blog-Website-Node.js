const express = require("express");
const mainRouter = require("./routes/main");
const moment = require("moment");
const postsRouter = require("./routes/posts");
const registerRouter = require("./routes/users");
var exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const { default: mongoose } = require("mongoose");
const MongoStore = require("connect-mongo");
const contactRouter=require("./routes/contact")
const admin=require("./routes/admin")
const methodOverride=require("method-override");
const app = express();
// Statik dosyaların bulunduğu klasörü belirt
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create({
  // options-to-control-prototype-access belirtilen sayfada bulunan seçenekleri kullanabilirsiniz
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    generateDate: (date, format) => {
      return moment(date).format(format);
    },
    limit:(arr,limit)=>{
      if(!Array.isArray(arr)){return []}
      else {return arr.slice(0,limit)}
    },
    truncate:(str,len)=>{
      if(str.length > len)
      {
        str=str.subString(0,len)+"...";
        return str;
      }
    },
    paginate:(options)=>{
        let outputHtml="";
      
        if(options.hash.current===1)
        {
            outputHtml += `<li class="page-item disabled"><a class="page-link" >First</a></li>`
        }
        else
        {
          outputHtml += `<li class="page-item "><a class="page-link" href="?page=1">First</a></li>`
  
        }
  
        let i=(Number(options.hash.current)>5 ? Number(options.hash.current)-3:1)
        if(i!== 1)
        {
          outputHtml += `<li class="page-item disabled "><a class="page-link" >...</a></li>`
        }

        for(; i <= (Number(options.hash.current) + 3 ) && i<=options.hash.pages;i++)
        {
          if(i === options.hash.current)
          {
            outputHtml += `<li class="page-item active "><a class="page-link" >${i}</a></li>`
          }
         else
          {
            outputHtml += `<li class="page-item"> <a class="page-link" href="?page=${i}" > ${i}</a> </li>`          }
            if(i==Number(options.hash.current)+3 && i<options.hash.pages)
            {
              outputHtml += `<li class="page-item disabled "><a class="page-link" >...</a></li>`
            }
        }
        if(options.hash.current==options.hash.pages)
        {
          outputHtml += `<li class="page-item disabled"><a class="page-link" >Last</a></li>`
        }
        else
        {
          outputHtml += `<li class="page-item "><a class="page-link" href="?page=${options.hash.pages}">Last</a></li>`
        }

        return outputHtml ;
       
      }
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(fileUpload());
//express session--connect mongo
app.use(
  expressSession({
    secret: "testotesto",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017",
      dbName: "nodeblog_db",
    }),
    cookie: {
      maxAge: 300000, // istek yapılmadığı sürece  5 dakika (milisaniye cinsinden) sonra oturum kapanır.
    },
  })
);


//display link
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals = {
      displayLink: true,
    };
  } else {
    res.locals = {
      displayLink: false,
    };
  }
  next();
});

//Flash - Message middleware
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(mainRouter);
app.use("/posts", postsRouter);
app.use("/users", registerRouter);
app.use("/admin",admin)
app.use("/contact",contactRouter)


module.exports = app;
