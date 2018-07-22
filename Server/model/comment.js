"use strict";
const mysql = require("../database/mysql_util");
const response = require("../lib/response");
const board = require("./board");
const model = new board();

class comment {
	constructor() {
	}

	async replyBoard(request) {
		let {
			board_id,
			comment
		} = request["param"];
		let exec = {};

		try {
			await mysql.beginTransaction(request["conn"]);

			exec["commentValid"] = await mysql.query({
				conn: request["conn"],
				query: `
					SELECT
						COUNT(*)
					FROM
						board
					WHERE
						board_id = :board_id AND comment IS NULL;
				`,
				bind: {
					board_id: board_id
				}
			});

			if(!exec["commentValid"]["results"][0]["COUNT(*)"]) {
				return response(403, 1003);
			}

			exec["commentInsert"] = await mysql.query({
				conn: request["conn"],
				query: `
					UPDATE
						board
					SET
						comment = :comment
					WHERE
						board_id = :board_id;
				`,
				bind: {
					comment: comment,
					board_id: board_id
				}
			});

			if(!exec["commentInsert"]["results"]["affectedRows"]) {
				await mysql.rollback(request["conn"]);
				throw new Error("affectedRows Error");
			}

			await mysql.commit(request["conn"]);

			exec["viewQuestion"] = await model.viewQuestionInfo({
				conn: request["conn"],
				bind: {
					board_id: board_id
				}
			});
		} catch(err) {
			throw err;
		} finally {
			mysql.release(request["conn"]);
		}

		return response(200, 1000, exec["viewQuestion"]["results"][0]);
	}
}

module.exports = comment;