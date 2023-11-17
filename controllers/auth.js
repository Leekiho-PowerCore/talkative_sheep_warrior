const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { decode } = require("punycode");
const gpt_service = require("../services/gpt-service.js");
const connection = require("../configs/db-connection.js").connection;
const connection2 = require("../configs/db-connection.js").connection2;

exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).render("login", {
        message: "Please provide an id and password",
      });
    }

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      async (error, result) => {
        console.log(result);
        if (
          !result ||
          result.length === 0 ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          res.status(401).render("login", {
            message: "Id or Password is incorrect",
          });
        } else {
          const user_id = result[0].user_id;

          const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.register = (req, res) => {
  console.log(req.body);

  const { name, id, password, passwordConfirm, mbti,  age, sex} = req.body;

  connection.query(
    "SELECT id FROM users WHERE id = ?",
    [id],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        return res.render("register", {
          message: "That id is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Passwords  do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      connection.query(
        "INSERT INTO users SET ?",
        { name: name, id: id, password: hashedPassword, mbti: mbti, age: age, sex: sex},
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
            return res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 토큰 검증
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 사용자가 존재하는지 확인
      connection.query(
        "SELECT * FROM users WHERE user_id = ?",
        [decoded.user_id],
        (error, result) => {
          if (!result || result.length === 0) {
            console.log(req.cookies.jwt);
            return next();
          }
          req.user = result[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};



exports.logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect("/");
};

exports.generate = async (req, res) => {
  let decoded; // Declare decoded variable outside the try block
  try {
    if (req.cookies.jwt) {
      // Verify the token
      decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
    }
    if (!decoded) {
      // Handle the case where the token is not valid or doesn't exist  
      return res.status(401).send("Unauthorized");
    }
    const { mbti, user_mbti, word } = req.body;
    console.log("generate");
    const mbtiResult = await gpt_service.generateResult(mbti, user_mbti, word);

    if (!mbtiResult || mbtiResult.length < 3) {
      console.log("결과를 생성할 수 없습니다.");
      return;
    }

    try {
      await gpt_service.insertArticle(mbtiResult, mbti, user_mbti, word, decoded.id);
    } catch (error) {
      console.error("data insert error:", error.message);
    }
  } catch (error) {
    console.error("생성 중 오류 발생:", error.message);
  }
  return res.redirect("/result");
};
