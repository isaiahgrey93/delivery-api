'use strict';

const Hapi = require('hapi');
const HapiAuthJwt = require('hapi-auth-jwt2');
const HapiPolicies = require('mrhorse');
const Dotenv = require('dotenv');
const Path = require('path');
const Api = require('./lib');
const Thinky = require('./lib/plugins/thinky');
const server = new Hapi.Server();

Dotenv.config({ path: Path.resolve(__dirname, '.env') });

server.connection({ port: 3000 });

server.register([
  // plugins
  HapiAuthJwt,
  {
    register: HapiPolicies,
    options: {
      policyDirectory: __dirname + '/lib/policies'
    }
  },
  {
    register: Thinky,
    options: {
      debug: false, 
      modelsPath: __dirname + '/lib/models',
      thinky: {
        rethinkdb: {
          host: 'localhost',
          port: 28015,
          db: "joey",
        }
      }
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