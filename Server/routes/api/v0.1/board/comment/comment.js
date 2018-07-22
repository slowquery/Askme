"use strict";
const Joi = require("joi");
const response = require(`${process["cwd"]()}/lib/response`);
const comment = require(`${process["cwd"]()}/model/comment`);
const model = new comment();

const reply = async(ctx) => {
	const {pool} = ctx;
	const {
		board_id
	} = ctx["params"];
	const {
		comment
	} = ctx["request"]["body"];

	const param_schema = Joi.object().keys({
		board_id: Joi.number().min(1).required()
	});

	const body_schema = Joi.object().keys({
		comment: Joi.string().min(1).required()
	});

	if(Joi.validate(ctx["params"], param_schema)["error"] || Joi.validate(ctx["request"]["body"], body_schema)["error"]) {
		ctx["status"] = 400;
		ctx["body"] = response(400, 1002);
		return;
	}

	try {
		const result = await model.replyBoard({
			conn: await pool.connection("MASTER"),
			param: {
				board_id: board_id,
				comment: comment
			}
		});

		result["subtype"] = "POSTCOMMENT";
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
	reply: reply
};