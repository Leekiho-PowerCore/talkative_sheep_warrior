const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { decode } = require("punycode");
const gpt_service = require("../services/gpt-service.js");
const connection = require("../configs/db-connection.js").connection;
const connection2 = require("../configs/db-connection.js").connection2;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide an email and password",
      });
    }

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, result) => {
        console.log(result);
        if (
          !result ||
          result.length === 0 ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          res.status(401).render("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = result[0].id;

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log("The token is " + token);

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

  const { name, email, password, passwordConfirm } = req.body;

  connection.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        return res.render("register", {
          message: "That email is already in use",
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
        { name: name, email: email, password: hashedPassword },
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
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // veriy the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log(decoded);
      console.log(decoded.id);

      // check if the user still exists
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (error, result) => {
          //console.log(result);

          if (!result) {
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
    next(); // by this next function, the code keep goes on after the authController.isLoggedin is done and render the page
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
    const userId = decoded;
    const { mymbti, member, word } = req.body;
    console.log("generate");
    const tweets = await gpt_service.generateTweets(mymbti, member, word);

    if (!tweets || tweets.length < 3) {
      console.log("트윗을 생성할 수 없습니다.");
      return;
    }

    try {
      await gpt_service.insertArticle(tweets, mymbti, member, word, decoded.id);
    } catch (error) {
      console.error("tweets insert error:", error.message);
    }
  } catch (error) {
    console.error("트윗 생성 중 오류 발생:", error.message);
  }
  return res.redirect("/result");
};


// exports.generate = async (req, res) => {
//   try {
//     const { mymbti, member, word } = req.body;
//     console.log("generate");
//     const tweets = await gpt_service.generateTweets(mymbti, member, word);

//     if (!tweets || tweets.length < 3) {
//       console.log("트윗을 생성할 수 없습니다.");
//       return;
//     }

//     try {
//       await gpt_service.insertArticle(tweets, mymbti, member, word);
//     } catch (error) {
//       console.error("tweets insert error :", error.message);
//     }
//   } catch (error) {
//     console.error("트윗 생성 중 오류 발생:", error.message);
//   }
//   return res.redirect("/result");
// };

