'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
    let auth = request.auth.credentials;
    let payload = request.payload || {};
    let params = request.params || {};

    if (auth.scope.indexOf('admin') > -1) {
        next(null, true);
    } else if (auth.id === params.user_id) {
        next(null, true);
    } else if (auth.id === payload.user_id) {
        next(null, true);
    } else if (auth.id === payload.driver_id) {
        next(null, true);
    } else if (auth.id === payload.requester_id) {
        next(null, true);
    } else {
        next(Boom.unauthorized(`Role <${auth.scope}> and user id: <${auth.id}> does not have the required permissions.`), false);
    }
};
