'use strict';

const Hapi = require('hapi');
const HapiAuthJwt = require('hapi-auth-jwt2');
const HapiPolicies = require('mrhorse');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Dotenv = require('dotenv');
const Fs = require('fs');
const Path = require('path');
const Api = require('./lib');
const Thinky = require('./lib/plugins/thinky');
const server = new Hapi.Server();
const fs = require('fs');

Dotenv.config({ path: Path.resolve(__dirname, '.env') });

server.connection({
    port: 3000,
    routes: {
        cors: true,
        payload: {
            "maxBytes": 50000000
        }
    },
});

server.register([
    // plugins
    Inert,
    Vision,
    HapiAuthJwt,
    HapiSwagger,
    {
        register: Thinky,
        options: {
            debug: true,
            modelsPath: __dirname + '/lib/models',
            thinky: {
                rethinkdb: {
                    db: "joey",
                    buffer: 5,
                    timeoutError: 10000,
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    ssl: {
                        ca: [fs.readFileSync( __dirname + '/rethink.cert').toString().trim()]
                    },
                }
            }
        }
    },
    {
        register: HapiPolicies,
        options: {
            policyDirectory: __dirname + '/lib/policies'
        }
    },
    {
        register: Api,
    }
], (err) => {
    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            console.error(`Server failed to start - ${err.message}`);
        }
        console.log(`Server started at ${server.info.uri}`);
    })
})
