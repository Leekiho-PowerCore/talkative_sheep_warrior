const express = require("express");
const authController = require("./auth");
const { decode } = require("jsonwebtoken");
const filter = require("../filter/filter");
const router = express.Router();

router.get("/", filter.isLoggedIn, (req, res) => {
    res.render("index", {
      user: req.user,
    });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/result", filter.isLoggedIn, (req, res) => {
  res.render("result", {
    user: req.user,
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", filter.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("profile", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/select", filter.isLoggedIn, (req, res) => {
  res.render("select", {
    user: req.user,
  });
});

router.get('/openkakao', filter.isLoggedIn, (req, res) => {
  res.render("openkakao", {
    user: req.user,
  });
});

router.post("/generate", authController.generate);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);




module.exports = router;



