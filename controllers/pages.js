const express = require("express");
const authController = require("./auth");
const { decode } = require("jsonwebtoken");
const filter = require("../filter/filter");
const router = express.Router();
const dash = require("../services/dashboard-service");

router.get("/", filter.isLoggedIn, (req, res) => {
	res.render("index", {
		user: req.user,
	});
});

router.get("/register", (req, res) => {
	res.render("register");
});

// router.get("/result", filter.isLoggedIn, async (req, res) => {
// try {
// console.log(req.user);
// const user_id = req.user.user_id;
// const userData = await authController.getUserDataByUserId(user_id);
// res.render("result", {
// user: req.user,
// compatibility: userData[0],
// });
// } catch (err) {
// console.error(err);
// res.status(500).send("Server Error");
// }
// });

router.get("/login", (req, res) => {
	res.render("login");
});

// router.get("/profile", filter.isLoggedIn, (req, res) => {
// if (req.user) {
// res.render("profile", {
// user: req.user,
// });
// } else {
// res.redirect("/login");
// }
// });

// router.get("/select", filter.isLoggedIn, (req, res) => {
// res.render("select", {
// user: req.user,
// });
// });

router.get("/openkakao", filter.isLoggedIn, async (req, res) => {
	try {
		if (req.user) {
			const page = parseInt(req.query.page) || 1;
			const mbti = req.query.mbti || "";
			console.log("/openkakao mbti", mbti);

			const { rows, paginator } = await authController.getOpenkakaoList2(
				page,
				mbti
			);

			res.render("../views/openkakao", {
				user: req.user,
				items: rows,
				paginator,
				mbti: mbti,
			});
		} else {
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

//재이수정
router.get("/dashboard", filter.isLoggedIn, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const category = req.query.category || "category";

		let rows;
		let paginator;

		if (category === "category") {
			console.log("category 들어옴");
			({ rows, paginator } = await dash.getCategoryList(page));
		} else if (category === "compatibility") {
			({ rows, paginator } = await dash.getCompatibilityList(page));
		} else if (category === "openkakao") {
			({ rows, paginator } = await dash.getOpenkakaoList(page));
		} else if (category === "rating") {
			({ rows, paginator } = await dash.getRatingList(page));
		} else if (category === "users") {
			({ rows, paginator } = await dash.getUsersList(page));
		} else {
			console.log("category is not valid");
		}

		console.log("dashboard rows:", rows, paginator);

		res.render("../views/dashboard", {
			rows,
			paginator,
			category,
		});
	} catch (error) {
		console.log(error);
	}
});

router.delete("/deleteCategory", async (req, res) => {
	try {
		const { category_id } = req.body;
		await dash.deleteCategory(category_id);
	} catch (error) {
		console.log(error);
	}
});

router.post("/insertCategory", async (req, res) => {
	try {
		const { category_name } = req.body;
		await dash.insertCategory(category_name);
	} catch (error) {
		console.log(error);
	}
});

router.post("/getCategory", async (req, res) => {
	const { category_name } = req.body;
	const category = await dash.getCategory(category_name);
	if (category) {
		return res.json({ isExist: true });
	} else {
		return res.json({ isExist: false });
	}
});

router.delete("/deleteCompatibility", async (req, res) => {
	try {
		const { compatibility_id } = req.body;
		await dash.deleteCompatibility(compatibility_id);
	} catch (error) {
		console.log(error);
	}
});
router.delete("/deleteOpenkakao", async (req, res) => {
	try {
		const { openkakao_id } = req.body;
		await dash.deleteOpenkakao(openkakao_id);
	} catch (error) {
		console.log(error);
	}
});
router.delete("/deleteRating", async (req, res) => {
	try {
		const { compatibility_id } = req.body;
		await dash.deleteRating(compatibility_id);
	} catch (error) {
		console.log(error);
	}
});
router.delete("/deleteUser", async (req, res) => {
	try {
		const { user_id } = req.body;
		await dash.deleteUser(user_id);
	} catch (error) {
		console.log(error);
	}
});

router.get("/result", filter.isLoggedIn, async (req, res) => {
	try {
		if (req.user) {
			console.log(req.user);
			const user_id = req.user.user_id;
			const userData = await authController.getUserDataByUserId(user_id);
			res.render("result", {
				user: req.user,
				compatibility: userData[0],
			});
		} else {
			res.redirect("/login");
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});
router.get("/profile", filter.isLoggedIn, (req, res) => {
	if (req.user) {
		// 서버의 시간대를 고려하여 Date 객체를 문자열로 변환하여 'YYYY-MM-DD' 형식으로 만듭니다.
		const rawDate = new Date(req.user.age);
		const year = rawDate.getFullYear();
		const month = String(rawDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1이 필요하며, 두 자리로 표시하려면 padStart를 사용합니다.
		const day = String(rawDate.getDate()).padStart(2, "0");

		const formattedUser = {
			...req.user,
			age: `${year}-${month}-${day}`,
		};

		res.render("profile", {
			user: formattedUser,
		});
	} else {
		res.redirect("/login");
	}
});

router.get("/select", filter.isLoggedIn, async (req, res) => {
	const categoryList = await authController.getCategoryList(); // 카테고리 목록을 가져옵니다.
	if (req.user) {
		res.render("select", {
			user: req.user,
			category: categoryList,
		});
	} else {
		res.redirect("/login");
	}
});

// router.get('/openkakao', filter.isLoggedIn, async (req, res) => {
// try {
// if (req.user) {
// const results = await authController.getOpenkakaoData();
// res.render("openkakao", {
// items: results,
// });
// } else {
// res.redirect("/login");
// }
// } catch (err) {
// console.error(err);
// res.status(500).send('Server Error');
// }
// });

//오픈카톡디비에서 가져오기
// router.post("/openkakao", filter.isLoggedIn, async (req, res) => {
// try {
// const data = req.body; // 요청 본문에서 데이터를 가져옵니다.
// const results = await authController.addOpenkakaoData(data);
// //const page = await dash.getTopList(page);
// res.status(200).send("Data inserted successfully");
// } catch (err) {
// console.error(err);
// res.status(500).send("Server Error");
// }
// });

//오픈카톡디비에 추가하기
router.post("/addData", async (req, res) => {
	const data = {
		mbti: req.body.mbti,
		main_category: req.body.main_category,
		kakao_address: req.body.kakao_address,
		intro: req.body.intro,
	};

	try {
		await authController.addOpenkakaoData(data);
		res.redirect("/openkakao"); // 데이터 추가 후 원하는 페이지로 리다이렉트
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

router.post("/update-profile", filter.isLoggedIn, authController.updateProfile);

router.post("/generate", authController.generate);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/score", authController.score);

module.exports = router;
