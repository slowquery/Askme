"use strict";
const Router = require("koa-router");
const router = new Router();

router.use("/board", require("./board").routes());

module.exports = router;