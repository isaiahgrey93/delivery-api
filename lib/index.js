'use strict';

const DbClient = require('thinky-loader');
const Core = require('./core');
const Utils = require('./utils');
const Routes = require('./routes');
const Boom = require('boom');
const util = require('util');

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
    core: Core,
    utils: Utils
  })

  server.ext('onPreResponse', function (request, reply) {
    let res = request.response;


    if (res instanceof Error) {
      let error = {
          error: res.output.payload.error,
          status: res.output.payload.statusCode,
          message : res.message,
          time: (new Date()).toLocaleString('en-US')
      }

      if (process.env.NODE_ENV === 'dev') {
        console.error(`\n`, util.inspect(error, { colors: true }), '\n');
      }

      return reply(error).code(error.status);
    }

    return reply.continue();
  })

  server.route([
    // 
    // User Routes
    // 
    { path: '/api/users', method: 'GET', config: Routes.user.getAll },
    { path: '/api/users/{user_id}', method: 'GET', config: Routes.user.getById },
    { path: '/api/users', method: 'POST', config: Routes.user.create },
    { path: '/api/users/{user_id}', method: 'PUT', config: Routes.user.update },
    { path: '/api/users/{user_id}', method: 'DELETE', config: Routes.user.remove },
    { path: '/api/users/login', method: 'POST', config: Routes.user.login },

    // 
    // Vehicle Routes
    // 
    { path: '/api/vehicles', method: 'GET', config: Routes.vehicle.getAll },
    { path: '/api/vehicles/{vehicle_id}', method: 'GET', config: Routes.vehicle.getById },
    { path: '/api/vehicles', method: 'POST', config: Routes.vehicle.create },
    { path: '/api/vehicles/{vehicle_id}', method: 'PUT', config: Routes.vehicle.update },
    { path: '/api/vehicles/{vehicle_id}', method: 'DELETE', config: Routes.vehicle.remove },

    // 
    // Preset Routes
    //
    { path: '/api/presets', method: 'GET', config: Routes.preset.getAll }, 
    { path: '/api/presets/{preset_id}', method: 'GET', config: Routes.preset.getById },
    { path: '/api/presets', method: 'POST', config: Routes.preset.create },
    { path: '/api/presets/{preset_id}', method: 'PUT', config: Routes.preset.update },
    { path: '/api/presets/{preset_id}', method: 'DELETE', config: Routes.preset.remove },

    // 
    // Drive Routes
    // 
    { path: '/api/drives', method: 'GET', config: Routes.drive.getAll },
    { path: '/api/drives/{drive_id}', method: 'GET', config: Routes.drive.getById },
    { path: '/api/drives', method: 'POST', config: Routes.drive.create },
    { path: '/api/drives/{drive_id}', method: 'PUT', config: Routes.drive.update },
    { path: '/api/drives/{drive_id}', method: 'DELETE', config: Routes.drive.remove },

    // 
    // Support Call Recordings
    // 
    { path: '/api/recordings', method: 'GET', config: Routes.recording.getAll },
    { path: '/api/recordings/{recording_id}', method: 'GET', config: Routes.recording.getById },
    { path: '/api/recordings', method: 'POST', config: Routes.recording.create },
    { path: '/api/recordings/{recording_id}', method: 'PUT', config: Routes.recording.update },
    { path: '/api/recordings/{recording_id}', method: 'DELETE', config: Routes.recording.remove },


    //
    // Stripe Account Routes
    //
    { path: '/api/accounts/{account_type}', method: 'GET', config: Routes.stripe.getAccountList },
    { path: '/api/accounts/{account_type}/{user_id}', method: 'GET', config: Routes.stripe.getAccount },
    { path: '/api/accounts/{account_type}/{user_id}', method: 'POST', config: Routes.stripe.createAccount },
    { path: '/api/accounts/{account_type}/{user_id}', method: 'PUT', config: Routes.stripe.updateAccount },
    { path: '/api/accounts/{account_type}/{user_id}', method: 'DELETE', config: Routes.stripe.removeAccount },
    // 
    // Stripe Charges Routes,
    // 
    { path: '/api/stripe/charges', method: 'POST', config: Routes.stripe.createCharge }
  ]);

  next();
};

module.exports.register.attributes = {
  name: 'api',
  version: '1.0.0'
};