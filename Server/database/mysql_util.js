"use strict";

const query = request => {
	return new Promise((resolve, reject) => {
		request["conn"].query(request["query"], request["bind"], (err, results, fields) => err ? reject(err) : resolve({results, fields}));
	});
};

const release = conn => {
	conn.release();
};

const beginTransaction = conn => {
	return new Promise((resolve, reject) => {
		conn.beginTransaction(err => err ? reject(err) : resolve(true));
	});
};

const commit = conn => {
	return new Promise((resolve, reject) => {
		conn.commit(err => err ? reject(err) : resolve(true));
	});
};

const rollback = conn => {
	return new Promise((resolve, reject) => {
		conn.rollback(err => err ? reject(err) : resolve(true));
	});
};

module.exports = {
	query: query,
	release: release,
	beginTransaction: beginTransaction,
	commit: commit,
	rollback: rollback
};