"use strict";

module.exports = {
	protocol: "https://",
	host: "api.ask.imustdo.work",
	service_host: "ask.imustdo.work",
	service: "ASK ME",
	service_name: "ASK ME",
	secret_key: "SECRET_KEY",
	port: 3333,
	fcm_key: "FCM_KEY",
	mysql: {
		master: {
			host: "HOST",
			user: "USER",
			password: "PASSWORD",
			database: "DBNAME",
			port: 3306,
			connectionLimit: 10
		},
		slave: [
			{
				host: "HOST",
				user: "USER",
				password: "PASSWORD",
				database: "DBNAME",
				port: 3306,
				connectionLimit: 10
			}
		]
	},
	redis: {
		host: "HOST",
		port: 6379,
		password: "HOST"
	}
};
