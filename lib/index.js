'use strict';

const DbClient = require('thinky-loader');
const Core = require('./core');
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
    // 
    // User Routes
    // 
    {
      path: '/api/users/{user_id}',
      method: 'GET',
      config: Routes.user.getById
    },
    {
      path: '/api/users',
      method: 'GET',
      config: Routes.user.getAll
    },
    {
      path: '/api/users/create',
      method: 'POST',
      config: Routes.user.create
    },
    {
      path: '/api/users/{user_id}',
      method: 'PUT',
      config: Routes.user.update
    },
    {
      path: '/api/users/{user_id}',
      method: 'DELETE',
      config: Routes.user.remove
    },
    {
      path: '/api/users/login',
      method: 'POST',
      config: Routes.user.login
    },

    // 
    // Vehicle Routes
    // 
    {
      path: '/api/vehicles/{vehicle_id}',
      method: 'GET',
      config: Routes.vehicle.getById
    },
    {
      path: '/api/vehicles',
      method: 'GET',
      config: Routes.vehicle.getAll
    },
    {
      path: '/api/vehicles',
      method: 'POST',
      config: Routes.vehicle.create
    },
    {
      path: '/api/vehicles/{vehicle_id}',
      method: 'PUT',
      config: Routes.vehicle.update
    },
    {
      path: '/api/vehicles/{vehicle_id}',
      method: 'DELETE',
      config: Routes.vehicle.remove
    },

    // 
    // Preset Routes
    // 
    {
      path: '/api/presets/{preset_id}',
      method: 'GET',
      config: Routes.preset.getById
    },
    {
      path: '/api/presets',
      method: 'GET',
      config: Routes.preset.getAll
    },
    {
      path: '/api/presets',
      method: 'POST',
      config: Routes.preset.create
    },
    {
      path: '/api/presets/{preset_id}',
      method: 'PUT',
      config: Routes.preset.update
    },
    {
      path: '/api/presets/{preset_id}',
      method: 'DELETE',
      config: Routes.preset.remove
    }
  ]);

  next();
};

module.exports.register.attributes = {
  name: 'api',
  version: '1.0.0'
};