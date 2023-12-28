const express = require("express");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.get("/register", (req, res) => {
  res.render("site/register");
});

router.post("/register", async (req, res) => {
  await User.create(req.body)
    .then((data) => {
      console.log(data); 
    })
    .catch((err) => {
      console.log(err);
    });
  req.session.sessionFlash = {
    type: "alert alert-success",
    message: `Hoşheldiniz! '${req.body.username}' başarılı bir şekilde eklendi.`,
  };
  res.redirect("/users/login");
});

router.get("/login", (req, res) => {
  // public/blog.html sayfasına yönlendir
  res.render("site/login");
});

router.post("/login", async (req, res) => {
  // public/blog.html sayfasına yönlendir

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.redirect("/users/register");
    return;
  }
  const controlPassword = await bcrypt.compare(password, user.password);
  if (!controlPassword) {
    res.redirect("/users/login");
    return;
  }

  createToken(req, user, res);
});

const createToken = async (req, user, res) => {
  const payload = { sub: user._id, name: user.name };
  const token = await jwt.sign(payload, process.env.JWT_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.ExPIRES,
  });
  user.token = token;
  req.session.userId = user._id; // giriş yapıldığında session UserId giriyorum
  res.redirect("/");
};

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });

  res.render("site/login");
});

module.exports = router;
