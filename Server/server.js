"use strict";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const utils = require("util");
const cors = require("@koa/cors");
const IO = require("koa-socket-2");

const mysqlPool = require("./database/mysql");
const util = require("./lib/util");
const config = require("./config");

const app = new Koa();
const io = new IO();

app.use(cors({
	origin: `${config["protocol"]}${config["service_host"]}`
}));
io.attach(app);

app.use(bodyParser());
app.use(json());

const pool = new mysqlPool();
app.use(async(ctx, next) => {
	ctx["io"] = io;
	ctx["pool"] = pool;
	await next();
});

app.io.use(async(ctx, next) => {
	ctx["pool"] = pool;
	next();
});

app.io.on("QUESTION", require("./middleware/socket")["postEvent"]);

app.use(async(ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(util.log `{green.bold.dim [REQUEST]} {green.bold ${ctx["method"]}} - {bold ${ctx["url"]}} - {${ctx["status"] === 200 ? "green" : "red"}.bold ${ctx["status"]}} - {yellow.bold ${ms}ms}`);
});

app.use(require("./routes").routes());

process.on("SIGINT", () => {
	pool.pool.end(err => {
		if(err) console.error(util.log.bgRed.black(err));
		else {
			console.log(util.log `{red.bold.dim [SHUTDOWN]} {cyan.bold MySQL Pool Cluster} {bold End}`);
			process.exit(1);
		}
	});
});

process.on("unhandledRejection", err => {
    console.error(utils.inspect(err, false, null));
});

process.on("uncaughtException", err => {
	console.log(util.log `{red.bold.dim [ERROR]} {bold UncaughtException: ${err}}`);
	console.log(util.log `{bold ${err["stack"]}}`);
});

console.log(util.log `{green.bold.dim [ENVIRONMENT]} {cyan.bold ${process["env"]["NODE_ENV"]}} {bold Mode}`);

app.listen(config["port"], "localhost", () => {
	console.log(util.log `{green.bold.dim [LISTEN]} {blue.bold ${config["service_name"]}} {green.bold ${config["port"]}} {bold Port Listen}`);
});

