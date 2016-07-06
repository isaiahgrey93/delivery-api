'use strict';

const Hapi = require('hapi');
const HapiAuthCookie = require('hapi-auth-cookie');
const Dotenv = require('dotenv');
const Path = require('path');
const Api = require('./lib');
const Thinky = require('./lib/plugins/thinky');
const server = new Hapi.Server();

Dotenv.config({ path: Path.resolve(__dirname, '.env') });

server.connection({ port: 3000 });

server.register([
  // plugins
  HapiAuthCookie,
  {
    register: Thinky,
    options: {
      debug: true, 
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