'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
    let auth = request.auth.credentials;
    let param_user_id = request.params.user_id;
    let payload_user_id = request.payload !== null ? request.payload.userId : false;

    if (auth.scope === 'admin') {
      return next(null, true);
    } else if (auth.id === param_user_id || auth.id === payload_user_id) {
      return next(null, true);
    } else {
      return next(Boom.unauthorized('Value for [scope] does not have the required permission.'), false);
    }
};

