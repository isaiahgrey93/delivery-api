'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
    let auth = request.auth.credentials;
    let owner_id = request.params.user_id || request.payload.userId;

    if (auth.scope === 'admin') {
      return next(null, true);
    } else if (auth.id === owner_id) {
      return next(null, true);
    } else {
      return next(Boom.unauthorized('Value for [scope] does not have the required permission.'), false);
    }
};

