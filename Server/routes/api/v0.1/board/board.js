"use strict";
const Joi = require("joi");
const response = require(`${process["cwd"]()}/lib/response`);
const board = require(`${process["cwd"]()}/model/board`);
const model = new board();

const removePost = async(ctx) => {
	const {pool} = ctx;
	const {
		board_id
	} = ctx["params"];

	const uri_schema = Joi.object().keys({
		board_id: Joi.number().min(1).required()
	});

	if(Joi.validate(ctx["params"], uri_schema)["error"]) {
		ctx["status"] = 400;
		ctx["body"] = response(400, 1002);
		return;
	}

	try {
		const result = await model.removePost({
			conn: await pool.connection("MASTER"),
			param: {
				board_id: board_id
			}
		});

		result["subtype"] = "REMOVEPOST";
		ctx["io"].broadcast("QUESTION", result);

		delete result["subtype"];

		ctx["status"] = result["status"];
		ctx["body"] = result;
		return;
	} catch(err) {
		console.error(err);
		ctx["status"] = 500;
		ctx["body"] = response(500, 1001);
		return;
	}
};


module.exports = {
	removePost: removePost
};