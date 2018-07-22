"use strict";
const Router = require("koa-router");
const router = new Router();
const board = require("./board");
const token = require(`${process["cwd"]()}/middleware/token`);

router.delete("/:board_id", token.headerAdminCheck, board.removePost);
router.use("/:board_id/comment", require("./comment").routes());

module.exports = router;