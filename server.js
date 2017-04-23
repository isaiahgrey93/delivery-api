"use strict";

require("now-logs")("joey-api");
const Hapi = require("hapi");
const HapiAuthJwt = require("hapi-auth-jwt2");
const HapiPolicies = require("mrhorse");
const HapiLout = require("lout");
const Inert = require("inert");
const Vision = require("vision");
const Dotenv = require("dotenv");
const Fs = require("fs");
const Path = require("path");
const Api = require("./old-lib");
const Thinky = require("./old-lib/plugins/thinky");
const server = new Hapi.Server();
const fs = require("fs");
const Logger = require("./old-lib/plugins/loggly");

const dbOptions = () => {
    if (process.env.NODE_ENV === "production") {
        return {
            db: "joey",
            buffer: 5,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: {
                ca: [
                    fs
                        .readFileSync(__dirname + "/rethink.cert")
                        .toString()
                        .trim()
                ]
            }
        };
    } else {
        return {
            db: "joey",
            buffer: 5,
            timeoutError: 20,
            host: "localhost",
            port: "28015"
        };
    }
};

Dotenv.config({ path: Path.resolve(__dirname, ".env") });

server.connection({
    port: 3000,
    routes: {
        cors: true,
        payload: {
            maxBytes: 50000000
        }
    }
});

server.register(
    [
        // plugins
        Inert,
        Vision,
        HapiAuthJwt,
        HapiLout,
        {
            register: Thinky,
            options: {
                debug: false,
                modelsPath: __dirname + "/old-lib/models",
                thinky: {
                    rethinkdb: dbOptions()
                }
            }
        },
        {
            register: HapiPolicies,
            options: {
                policyDirectory: __dirname + "/old-lib/policies"
            }
        },
        {
            register: Api
        }
    ],
    err => {
        if (err) {
            throw err;
        }

        server.start(err => {
            if (err) {
                console.error(`Server failed to start - ${err.message}`);
            }
            console.log(`Server started at ${server.info.uri}`);
        });
    }
);
