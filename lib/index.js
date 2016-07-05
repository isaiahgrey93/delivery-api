'use strict';

var User = require('./routes/user')

module.exports.register = (server, options, next) => {

  server.auth.strategy('session', 'cookie', {
    cookie: 'sid',
    password: 'asdlfjdlskjklxzcv;j598sduf;,.xfd;]a9sdjf478dfiudxjsyxzkwopfg9',
    clearInvalid: false,
    keepAlive: true,
    ttl: 1000 * 60 * 15,  // 15 minutes
    redirectTo: false,
    redirectOnTry: false,
    isHttpOnly: true,     // Allow the front end to access the cookie from JavaScript
    isSecure: false       // This should be true, assuming HTTPS is used in production
  });

  server.route([
    // routes
    {
      path: '/api/users/create',
      method: 'POST',
      config: User.create
    }
  ])

  next();
};

module.exports.register.attributes = {
  name: 'api',
  version: '1.0.0'
};