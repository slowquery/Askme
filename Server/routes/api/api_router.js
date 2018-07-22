"use strict";
const config = require("../../config");

const index = ctx => {
	ctx.body = config["service_name"];
	return;
};

module.exports = {
	index: index
};