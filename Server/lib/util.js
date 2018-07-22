"use strict";
const chalk = require("chalk");
const utils = require("utils");
const crypto = require("crypto");
const request = require("request");
const config = require("../config");

const allLog = data => {
	console.log(utils.inspect(data, false, null));
};

const sha512Hash = (hash) => {
	return crypto.createHmac("sha512", config["secret_key"]).update(hash).digest("hex");
};

const fcm_send = (form) => {
	return new Promise((resolve, reject) => {
		request({
			url: "https://fcm.googleapis.com/fcm/send",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `key=${config["fcm_key"]}`
			},
			json: form
		}, (err, res, html) => err ? reject(err) : resolve(html));
	});
};

module.exports = {
	log: chalk,
	allLog: allLog,
	sha512Hash: sha512Hash,
	fcm_send: fcm_send
};