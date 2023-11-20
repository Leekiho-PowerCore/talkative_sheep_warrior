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

router.get("/result", filter.isLoggedIn, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const userData = await authController.getUserDataByUserId(user_id);
    res.render("result", {
      user: req.user,
      compatibility: userData[0],
    });
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
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

router.get('/openkakao', filter.isLoggedIn, async (req, res) => {
  try {
    const results = await authController.getOpenkakaoData();
    res.render("openkakao", {
      items: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//오픈카톡디비에서 가져오기
router.post('/openkakao', filter.isLoggedIn, async (req, res) => {
  try {
    const data = req.body; // 요청 본문에서 데이터를 가져옵니다.
    const results = await authController.addOpenkakaoData(data);
    res.status(200).send('Data inserted successfully');
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//오픈카톡디비에 추가하기
router.post('/addData', async (req, res) => {
  const data = {
    mbti: req.body.mbti,
    main_category: req.body.main_category,
    kakao_address: req.body.kakao_address,
    intro: req.body.intro
  };
  
  try {
    await authController.addOpenkakaoData(data);
    res.redirect('/openkakao'); // 데이터 추가 후 원하는 페이지로 리다이렉트
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post("/generate", authController.generate);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);




module.exports = router;



