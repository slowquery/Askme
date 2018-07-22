"use strict";
const Joi = require("joi");
const response = require("../lib/response");
const board = require(`${process["cwd"]()}/model/board`);
const model = new board();

const viewPost = async(ctx) => {
	const {pool} = ctx;
	const {
		id
	} = ctx["data"];

	const param_schema = Joi.object().keys({
		id: Joi.number().min(1).optional()
	});

	if(Joi.validate(ctx["data"], param_schema)["error"]) {
		ctx["socket"].compress(true).emit("socket_error", response(400, 1002));
		return;
	}

	try {
		const result = await model.viewQuestion({
			conn: await pool.connection("SLAVE*"),
			param: {
				id: id
			}
		});

		result["subtype"] = "LIST";
		ctx["socket"].compress(true).emit("QUESTION", result);
		return;
	} catch(err) {
		console.error(err);
		ctx["socket"].compress(true).emit("socket_error", response(500, 1001));
		ctx["socket"].disconnect();
	}
};

const doQuestion = async(ctx) => {
	const {pool} = ctx;
	const {
		user_nick,
		content
	} = ctx["data"];

	const param_schema = Joi.object().keys({
		user_nick: Joi.string().min(1).max(50).required(),
		content: Joi.string().min(1).max(200).required()
	});

	if(Joi.validate(ctx["data"], param_schema)["error"]) {
		ctx["socket"].compress(true).emit("socket_error", response(400, 1004));
		return;
	}

	try {
		const result = await model.addQuestion({
			conn: await pool.connection("MASTER"),
			param: {
				user_nick: user_nick,
				content: content
			}
		});

		result["subtype"] = "NEWPOST";
		ctx["socket"].compress(true).emit("QUESTION", result);
		ctx["socket"].compress(true).broadcast.emit("QUESTION", result);
		return;
	} catch(err) {
		console.error(err);
		ctx["socket"].compress(true).emit("socket_error", response(500, 1001));
		ctx["socket"].disconnect();
	}
};

const askBoardCount = async(ctx) => {
	const {pool} = ctx;

	try {
		const result = await model.countQuestion({
			conn: await pool.connection("SLAVE*")
		});

		result["subtype"] = "COUNT";
		ctx["socket"].compress(true).emit("QUESTION", result);
		return;
	} catch(err) {
		console.error(err);
		ctx["socket"].compress(true).emit("socket_error", response(500, 1001));
		ctx["socket"].disconnect();
	}
};

module.exports = {
	viewPost: viewPost,
	doQuestion: doQuestion,
	askBoardCount: askBoardCount
};