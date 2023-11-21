const connection = require("../configs/db-connection.js").connection;
const paginator_util = require("../utils/paginator.js");

const perPage = 15;
const offset = (page - 1) * perPage;

async function getUserList(page) {
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
		throw error;
	}
}

async function getCompatibilityList(page) {
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
		throw error;
	}
}

async function getCategoryList(page) {
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
		throw error;
	}
}

async function getOpenkakaoList(page) {
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
		throw error;
	}
}

async function getTopList(page) {
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
		throw error;
	}
}

module.exports = {
	getUserList,
	getCompatibilityList,
	getCategoryList,
	getOpenkakaoList,
	getTopList,
};
