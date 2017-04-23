"use strict";

const Boom = require("boom");
const Core = require("../core");

module.exports = function(request, reply, next) {
	let auth = request.auth.credentials;
	let isScopePresent = request.payload.scope
		? request.payload.scope.length > 0
		: false;
	let isScopeAdmin = isScopePresent
		? request.payload.scope.indexOf("admin") > -1
		: false;
	let isRoleAdmin = auth.scope.indexOf("admin") > -1;

	// if scope is not present in the request, continue on.
	if (!isScopePresent) {
		next(null, true);

		// only allow an non-admin scope to be set.
	} else if (isScopeAdmin) {
		next(
			Boom.unauthorized(
				`Role <${auth.scope}> with user id: <${auth.id}> is not allowed to change another user\'s role to <admin>.`
			)
		);

		// only allow an admin to update non-admin's scope
	} else if (isRoleAdmin) {
		Core.model("User")
			.findById(request.params.user_id)
			.then(user => {
				// deny if resource to update has role `admin`
				if (user.scope.indexOf("admin") > -1) {
					next(
						Boom.unauthorized(
							`Role <${auth !== null ? auth.scope : "guest"}> with user id: <${auth !== null ? auth.id : "guest"}> is not allowed to change role <${user !== null ? user.scope : "guest"}> with user id: <${user !== null ? user.id : "guest"}> to new role.`
						)
					);
				} else {
					next(null, true);
				}
			})
			.catch(err => next(err, false));

		// non-admin roles are not allowed to update <scope> field
		// remove scope field & continue
	} else {
		delete request.payload.scope;

		next(null, true);
	}
};
