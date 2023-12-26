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
const app = express();
// Statik dosyaların bulunduğu klasörü belirt
app.use(express.static("public"));
app.use(express.json());

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

//Flash - Message middleware
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});
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

app.use(mainRouter);
app.use("/posts", postsRouter);
app.use("/users", registerRouter);

module.exports = app;
