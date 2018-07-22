"use strict";
const mysql = require("mysql");
const util = require("../lib/util");
const config = require("../config");

const queryFormat = function (query, values) {
	if (!values) return query;
	return query.replace(/\:(\w+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return this.escape(values[key]);
		}
		return txt;
	}.bind(this));
};

class mysqlPool {
    constructor() {
        this.poolCluster = mysql.createPoolCluster();
        this.init();
    }

    init() {
    	config["mysql"]["master"]["queryFormat"] = queryFormat;

        this.poolCluster.add("MASTER", config["mysql"]["master"]);

        for(const [index, mysqlConfig] of config["mysql"]["slave"].entries()) {
        	mysqlConfig["queryFormat"] = queryFormat;
	        this.poolCluster.add(`SLAVE${index+1}`, mysqlConfig);
        }

		console.log(util.log `{green.bold.dim [DATABASE]} {cyan.bold MySQL Pool Cluster} {bold Init}`);
	}

	get pool() {
    	return this.poolCluster;
	}

	connection(target) {
    	return new Promise((resolve, reject) => {
    		this.poolCluster.of(target, "RANDOM");
			this.poolCluster.getConnection(target, (err, conn) => err ? reject(err) : resolve(conn));
		});
	}
}

module.exports = mysqlPool;
