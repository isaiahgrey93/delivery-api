'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
    let auth = request.auth.credentials;
    let payload = request.payload || {};
    let params = request.params || {};

    if (auth.scope === 'admin') {
      return next(null, true);
    } else if (auth.id === params.user_id) {
      return next(null, true);
    } else if (auth.id === payload.user_id) {
      return next(null, true);
    } else if (auth.id === payload.driver_id) {
      return next(null, true);
    } else if (auth.id === payload.requester_id) {
      return next(null, true);
    } else {
      return next(Boom.unauthorized(`Role <${auth.scope}> and user id: <${auth.id}> does not have the required permissions.`), false);
    }
};

