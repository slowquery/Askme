"use strict";
const Router = require("koa-router");
const router = new Router();
const comment = require("./comment");
const token = require(`${process["cwd"]()}/middleware/token`);

router.post("/", token.headerAdminCheck, comment.reply);

module.exports = router;