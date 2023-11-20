const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { decode } = require("punycode");
const connection = require("../configs/db-connection.js").connection;

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

exports.redirectIfLoggedIn = (req, res, next) => {
	if (req.user) {
		res.redirect("/main");
	} else {
		next();
	}
};
