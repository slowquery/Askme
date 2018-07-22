"use strcit";
const util = require(`${process["cwd"]()}/lib/util`);
const config = require(`${process["cwd"]()}/config`);
const response = require(`${process["cwd"]()}/lib/response`);

const headerAdminCheck = async(ctx, next) => {
	if(!ctx["headers"]["authorization"] || util.sha512Hash(ctx["headers"]["authorization"]) !== util.sha512Hash(config["secret_key"])) {
		ctx["status"] = 401;
		ctx["body"] = response(401, 1005);
		return;
	}
	await next();
};

module.exports = {
	headerAdminCheck: headerAdminCheck
};