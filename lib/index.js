'use strict';

const DbClient = require('thinky-loader');
const JWT = require('jsonwebtoken');
const Core = require('./core')
const Routes = require('./routes');

module.exports.register = (server, options, next) => {

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET, 
    validateFunc: (decoded, request, callback) => {
      if (!decoded.id) return callback(null, false);
      else return callback(null, true);
    },
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.auth.default({ strategy: 'jwt' });

  server.bind({
    db: {
      orm: DbClient.thinky,
      models: DbClient.models
    },
    core: Core
  })

  server.route([
    // user routes
    {
      path: '/api/users/create',
      method: 'POST',
      config: Routes.user.create
    },
    {
      path: '/api/users/login',
      method: 'POST',
      config: Routes.user.login
    },
    {
      path: '/api/users/{user_id}',
      method: 'GET',
      config: Routes.user.profile
    },

    // vehicle routes
    {
      path: '/api/vehicles/create',
      method: 'POST',
      config: Routes.vehicle.create
    }
  ]);

  next();
};

module.exports.register.attributes = {
  name: 'api',
  version: '1.0.0'
};