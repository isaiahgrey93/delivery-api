'use strict';

const ORM = require('thinky-loader')
const Boom = require('boom');
const Mailer = require('../plugins/mailer');
const SwigEmailTemplates = require('swig-email-templates');
const EmailTemplates = new SwigEmailTemplates({
	root: './lib/templates'
});


module.exports.findByEmail = (email) => {
	return ORM.models.User
	.filter({ email: email })
	.limit(1)
	.then((users) => users.length > 0 ? users[0] : false)
}

module.exports.findByRole = (role) => {
	return ORM.models.User
	.filter({ scope: [role] })
	.then((users) => users)
}

module.exports.query = (query, options) => {
    if (!options) options = {};
    if (!query) query = {};

    // console.log(options.geometry, query)

    return getGeoQuery(ORM.models.User, options.geometry)
        .filter(query, {})
        .getJoin(options.populate)
}

const getGeoQuery = (query, geometry) => {
    if (!geometry) return query;

    return query.getIntersecting(geometry, { index: 'geo' })
}

module.exports.sendResetPasswordLink = (user) => {
	const URI = process.env.NODE_ENV === 'development'
		? `http://${process.env.BASE_URI}:${process.env.PORT}`
		: 'https://joey-api.now.sh'

	return new Promise((resolve, reject) => {
		EmailTemplates.render('email/password_reset.html', {
			name: user.first_name || user.email,
			token: user.password_reset.token,
			email: user.email,
			base: URI
		}, (err, html, text) => {
			console.log('\n')
			console.log(html)
			if (err) reject(err);

			Mailer.sendMail({
				from: `Joey ${process.env.COMPANY_EMAIL_ADDRESS}`,
				to:  user.email,
				subject: `Password reset request for ${user.name || user.email}.`,
				html: html,
			}, (err, info) => {
				if (err) reject(err);
				else resolve(info);
			})
		})
	});

}
