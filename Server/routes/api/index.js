"use strict";
const Router = require("koa-router");
const router = new Router();
const api_router = require("./api_router");

const versions = {
	"0.1": require("./v0.1")
};

router.get("/", api_router.index);
for(let version in versions)
	router.use(`/v${version}`, versions[version].routes());

module.exports = router;