'use strict';

const DbClient = require('thinky-loader');
const Core = require('./core');
const Utils = require('./utils');
const Node_utils = require('util');
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
                console.error(`\n`, Node_utils.inspect(error, { colors: true }), '\n');
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
        { path: '/api/users/{email}/password', method: 'POST', config: Routes.user.password_reset_request },
        { path: '/api/users/{email}/password/{token_id}', method: 'POST', config: Routes.user.reset_password },

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
        { path: '/api/drives/{drive_id}/estimate', method: 'POST', config: Routes.drive.estimate },
        { path: '/api/drives/{drive_id}/charge', method: 'POST', config: Routes.drive.charge },
        { path: '/api/drives/{drive_id}/process', method: 'POST', config: Routes.drive.process },
        { path: '/api/drives/{drive_id}/refund', method: 'POST', config: Routes.drive.refund },

        //
        // Support Calls/Recordings
        //
        { path: '/api/recordings', method: 'GET', config: Routes.recording.getAll },
        { path: '/api/recordings/{recording_id}', method: 'GET', config: Routes.recording.getById },
        { path: '/api/recordings', method: 'POST', config: Routes.recording.create },
        { path: '/api/recordings/{recording_id}', method: 'PUT', config: Routes.recording.update },
        { path: '/api/recordings/{recording_id}', method: 'DELETE', config: Routes.recording.remove },
        { path: '/api/support-call/open', method: 'POST', config: Routes.support.open },
        { path: '/api/support-call/{drive_id}/close', method: 'POST', config: Routes.support.close },

        //
        // Stripe Account Routes
        //
        { path: '/api/accounts', method: 'GET', config: Routes.stripe.getAll },
        { path: '/api/accounts/{user_id}', method: 'GET', config: Routes.stripe.findById},
        { path: '/api/accounts/{user_id}', method: 'POST', config: Routes.stripe.create},
        { path: '/api/accounts/{user_id}', method: 'PUT', config: Routes.stripe.update},
        { path: '/api/accounts/{user_id}', method: 'DELETE', config: Routes.stripe.remove },

        //
        // Upload Routes
        //
        { path: '/api/uploads/{path*}', method: 'POST', config: Routes.upload.create },
        { path: '/api/uploads/{path*}', method: 'DELETE', config: Routes.upload.remove },
        { path: '/api/uploads/{path*}', method: 'GET', config: Routes.upload.fetch }

    ]);

    next();
};

module.exports.register.attributes = {
    name: 'api',
    version: '1.0.0'
};
