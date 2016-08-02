'use strict';

const Boom = require('boom');
const Core = require('../core');

module.exports = function(request, reply, next) {
	let auth = request.auth.credentials;
	let isScopePresent = request.payload.scope !== undefined || request.payload.scope.length > 0;
	let isRoleAdmin = auth.scope.indexOf('admin') > -1;

	// if scope is not present in the request, continue on.
	if (!isScopePresent) {
		return next(null, true);

	// only allow an admin to update non-admin's scope
	} else if (isRoleAdmin) {

		Core.model('User').findById(request.params.user_id)
			.then((user) => {

				// deny if resource to update has role `admin`
				if (user.scope.indexOf('admin') > -1) {
					next(Boom.unauthorized(`Role <${auth.scope}> with user id: <${auth.id}> is not allowed to change role <${user.scope}> with user id: <${user.id}> to new role.`))
				} else {
					next(null, true)
				}

			})
			.catch((err) => next(err, false));

	// non-admin roles are not allowed to update <scope> field
	// remove scope field & continue
	} else {
		delete request.payload.scope;
	  
	  next(null, true);
	}
};

