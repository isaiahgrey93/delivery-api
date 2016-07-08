'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
    let credentials = request.auth.credentials;
    let id = request.params.user_id;

    if (credentials.scope !== 'admin' && credentials.id !== id) {
      return next(Boom.unauthorized('Value for [scope] does not have the required permission.'), false);
    } else {
      next(null, true);
    }
};
