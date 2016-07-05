'use strict';

const Hapi = require('hapi');
const Dotenv = require('dotenv');
const Path = require('path');
const server = new Hapi.Server();

Dotenv.config({ path: Path.resolve(__dirname, '.env') });

server.connection({ port: 3000 });

server.register([
  // plugins
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