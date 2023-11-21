const connection = require("../configs/db-connection.js").connection;
const paginator_util = require("../utils/paginator.js");

const perPage = 15;

async function getUserList(page) {
	const offset = (page - 1) * perPage;
	try {
		const [rows, totalCountRows] = await Promise.all([
			new Promise((resolve, reject) => {
				connection.query(
					`select * from user order by user_id desc limit ${offset}, ${perPage}`,
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows);
						}
					}
				);
			}),
			new Promise((resolve, reject) => {
				connection.query(
					"select count(*) as totalCount from user",
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows[0].totalCount);
						}
					}
				);
			}),
		]);

		const paginator = paginator_util.createPaginator({
			totalCount: totalCountRows,
			page,
			perPage,
		});

		return { rows, paginator };
	} catch (error) {
		console.log("getUserList error: ", error.message);
	}
}

async function getCompatibilityList(page) {
	const offset = (page - 1) * perPage;
	try {
		const [rows, totalCountRows] = await Promise.all([
			new Promise((resolve, reject) => {
				connection.query(
					`select * from compatibility order by compatibility_id desc limit ${offset}, ${perPage}`,
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows);
						}
					}
				);
			}),
			new Promise((resolve, reject) => {
				connection.query(
					"select count(*) as totalCount from compatibility",
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows[0].totalCount);
						}
					}
				);
			}),
		]);

		const paginator = paginator_util.createPaginator({
			totalCount: totalCountRows,
			page,
			perPage,
		});

		return { rows, paginator };
	} catch (error) {
		console.log("getCompatibilityList error: ", error.message);
	}
}

async function getCategoryList(page) {
	const offset = (page - 1) * perPage;
	try {
		const [rows, totalCountRows] = await Promise.all([
			new Promise((resolve, reject) => {
				connection.query(
					`select * from category order by category_id desc limit ${offset}, ${perPage}`,
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows);
						}
					}
				);
			}),
			new Promise((resolve, reject) => {
				connection.query(
					"select count(*) as totalCount from category",
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows[0].totalCount);
						}
					}
				);
			}),
		]);

		const paginator = paginator_util.createPaginator({
			totalCount: totalCountRows,
			page,
			perPage,
		});

		return { rows, paginator };
	} catch (error) {
		console.log("getCategoryList error:", error.message);
	}
}

async function getOpenkakaoList(page) {
	const offset = (page - 1) * perPage;
	try {
		const [rows, totalCountRows] = await Promise.all([
			new Promise((resolve, reject) => {
				connection.query(
					`select * from openkakao order by openkakao_id desc limit ${offset}, ${perPage}`,
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows);
						}
					}
				);
			}),
			new Promise((resolve, reject) => {
				connection.query(
					"select count(*) as totalCount from openkakao",
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows[0].totalCount);
						}
					}
				);
			}),
		]);

		const paginator = paginator_util.createPaginator({
			totalCount: totalCountRows,
			page,
			perPage,
		});

		return { rows, paginator };
	} catch (error) {
		console.log("getOpenkakaoList error: ", error.message);
	}
}

async function getTopList(page) {
	const offset = (page - 1) * perPage;
	try {
		const [rows, totalCountRows] = await Promise.all([
			new Promise((resolve, reject) => {
				connection.query(
					`select * from top order by compatibility_id desc limit ${offset}, ${perPage}`,
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows);
						}
					}
				);
			}),
			new Promise((resolve, reject) => {
				connection.query(
					"select count(*) as totalCount from top",
					(error, rows) => {
						if (error) {
							reject(error);
						} else {
							resolve(rows[0].totalCount);
						}
					}
				);
			}),
		]);

		const paginator = paginator_util.createPaginator({
			totalCount: totalCountRows,
			page,
			perPage,
		});

		return { rows, paginator };
	} catch (error) {
		console.log("getTopList error:", error.message);
	}
}

module.exports = {
	getUserList,
	getCompatibilityList,
	getCategoryList,
	getOpenkakaoList,
	getTopList,
};
