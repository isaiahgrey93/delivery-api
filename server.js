"use strict";

require("now-logs")("joey-api-new");
const Hapi = require("hapi");
const HapiAuthJwt = require("hapi-auth-jwt2");
const HapiPolicies = require("mrhorse");
const HapiLout = require("lout");
const Inert = require("inert");
const Vision = require("vision");
const Dotenv = require("dotenv");
const Fs = require("fs");
const Path = require("path");
const Api = require("./api");
const server = new Hapi.Server();
const fs = require("fs");

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
        Inert,
        Vision,
        HapiAuthJwt,
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
