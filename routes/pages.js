const express = require('express');
const authController = require('../controllers/auth');
const { decode } = require('jsonwebtoken');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user
    });
});

router.get('/register', (req, res) => {
    res.render('register');
}); 

router.get('/result', authController.isLoggedIn, (req, res) => {
    res.render('result', {
        user: req.user
    });
});

router.get('/login', (req, res) => {
    res.render('login');
}); 

router.get("/generate", async (req, res) => {
    try {
        console.log("router");

      res.render("index", {});
    } catch (error) {
      console.error(
        "Error while fetching article list and category list:",
        error
      );
      res.status(500).send("Internal Server Error");
    }
  });

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.post("/generate", authController.generate);


module.exports = router;
