"use strict";
const mysql = require(`${process["cwd"]()}/database/mysql_util`);
const util = require(`${process["cwd"]()}/lib/util`);
const response = require(`${process["cwd"]()}/lib/response`);
const htmlspecialchars = require("htmlspecialchars");

class board {
	constructor() {
		/*
			`board` Schema Model

			board_id INT AUTO_INCREMENT NOT NULL PK
			user_nick VARCHAR(50) NOT NULL
			content TEXT NOT NULL
			comment TEXT NOT NULL
			status TINYINT DEFAULT 1
			board_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
		*/
	}

	async viewQuestionInfo(request) {
		return await mysql.query({
			conn: request["conn"],
			query: `
				SELECT
					board_id,
					user_nick,
					content,
					comment,
					board_created
				FROM
					board
				WHERE
					board_id = :board_id AND status IS NOT NULL;
			`,
			bind: request["bind"]
		});
	}

	async addQuestion(request) {
		let {
			user_nick,
			content
		} = request["param"];
		let exec = {};

		try {
            await mysql.beginTransaction(request["conn"]);

			exec["boardInsert"] = await mysql.query({
				conn: request["conn"],
				query: `
					INSERT INTO board (user_nick, content) 
					VALUES (:user_nick, :content);
				`,
				bind: {
					user_nick: htmlspecialchars(user_nick).slice(0, 50),
					content: htmlspecialchars(content).slice(0, 200)
				}
			});

			if(!exec["boardInsert"]["results"]["affectedRows"]) {
				await mysql.rollback(request["conn"]);
				throw new Error("affectedRows Error");
			}

			await mysql.commit(request["conn"]);

			exec["viewQuestion"] = await this.viewQuestionInfo({
				conn: request["conn"],
				bind: {
					board_id: exec["boardInsert"]["results"]["insertId"]
				}
			});

			await util.fcm_send({
				notification: {
					title: `${user_nick}님이 질문을 등록하였습니다.`,
					text: `${content}`,
					sound: "beep"
				},
				to: '/topics/all'
			});
		} catch(err) {
			throw err;
		} finally {
			mysql.release(request["conn"]);
		}

		return response(200, 1000, exec["viewQuestion"]["results"][0]);
	}

	async viewQuestion(request) {
		let {
			id
		} = request["param"];
		let exec = {};

		try {
			exec["min"] = await mysql.query({
				conn: request["conn"],
				query: `
					SELECT
						MIN(board_id)
					FROM
						board;
				`
			});

			if(!id) {
				exec["board"] = await mysql.query({
					conn: request["conn"],
					query: `
						SELECT
							board_id,
							user_nick,
							content,
							comment,
							board_created
						FROM
							board
						WHERE
							status IS NOT NULL
						ORDER BY 
							board_id
						DESC
						LIMIT
							5;
					`
				});
			}
			else {
				exec["board"] = await mysql.query({
					conn: request["conn"],
					query: `
						SELECT
							board_id,
							user_nick,
							content,
							comment,
							board_created
						FROM
							board
                        WHERE
                            board_id < ${id} AND status IS NOT NULL
						ORDER BY 
							board_id
						DESC
						LIMIT
							5;
					`,
					bind: {
						id: id
					}
				});
			}

			if(!exec["board"]["results"][0] || exec["board"]["results"][exec["board"]["results"].length-1]["board_id"] === exec["min"]["results"][0]["MIN(board_id)"]) {
				exec["next"] = null;
			}
			else {
				exec["next"] = exec["board"]["results"][exec["board"]["results"].length-1]["board_id"];
			}

		} catch(err) {
			throw err;
		} finally {
			mysql.release(request["conn"]);
		}

		return response(200, 1000, {
			post: exec["board"]["results"],
			next: exec["next"]
		});
	}

	async countQuestion(request) {
		let exec = {};

		try {
			exec["countBoard"] = await mysql.query({
				conn: request["conn"],
				query: `
					SELECT
						COUNT(*)
					FROM
						board
					WHERE
						status IS NOT NULL;
				`
			});
		} catch(err) {
			throw err;
		} finally {
			mysql.release(request["conn"]);
		}

		return response(200, 1000, {
			count: exec["countBoard"]["results"][0]["COUNT(*)"]
		});
	}

	async removePost(request) {
		const {
			board_id
		} = request["param"];
		let exec = {};

		try {
			await mysql.beginTransaction(request["conn"]);

			exec["removePost"] = await mysql.query({
				conn: request["conn"],
				query: `
					UPDATE
						board
					SET
						status = NULL
					WHERE  
						board_id = :board_id;
				`,
				bind: {
					board_id: board_id
				}
			});

			if(!exec["removePost"]["results"]["changedRows"]) {
				await mysql.rollback(request["conn"]);
				return response(400, 1003);
			}

			await mysql.commit(request["conn"]);
		} catch(err) {
			throw err;
		} finally {
			mysql.release(request["conn"]);
		}

		return response(200, 1000, {board_id: board_id});
	}
}

module.exports = board;