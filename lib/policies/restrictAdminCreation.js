'use strict';

const Boom = require('boom');

module.exports = function(request, reply, next) {
	let auth = request.auth.credentials;
	let isRoleAdmin = auth !== null ? auth.scope.indexOf('admin') > -1 : false;
	let isScopeAdmin = request.payload.scope !== undefined && request.payload.scope.indexOf('admin') > -1;

	// if scope is not present in the request, continue on.
	if (isRoleAdmin) {
		next(null, true);

	// if scope to set is admin, and request is not authenticated by admin, deny
	} else if (!isRoleAdmin && isScopeAdmin) {

		next(Boom.unauthorized(`Role <${auth !== null ? auth.scope : 'guest'}> and user id: <${auth !== null ? auth.id : 'guest'}> does not have the required permissions.`), false)

	} else {
		next(null, true);
	}
};
