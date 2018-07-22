"use strict";
const response = require("../lib/response");

const postEvent = async(ctx) => {
	const {
		subtype
	} = ctx["data"];

	if(!subtype) {
		ctx["socket"].compress(true).emit("socket_error", response(400, 1002));
		ctx["socket"].disconnect();
		return;
	}
	else
		delete ctx["data"]["subtype"];

	switch(subtype) {
		case "VIEW":
			require(`${process["cwd"]()}/socket/socket`)["viewPost"](ctx);
			break;
		case "POST":
			require(`${process["cwd"]()}/socket/socket`)["doQuestion"](ctx);
			break;
		case "COUNT":
			require(`${process["cwd"]()}/socket/socket`)["askBoardCount"](ctx);
			break;
	}

	return;
};

module.exports = {
	postEvent: postEvent
};