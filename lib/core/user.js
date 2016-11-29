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

module.exports.sendResetPasswordLink = (user) => {
	return new Promise((resolve, reject) => {
		EmailTemplates.render('email/password_reset.html', {
			name: user.name || user.email,
			token: user.password_reset.token,
			email: user.email,
			base: `${process.env.BASE_URI}:${process.env.PORT}`
		}, (err, html, text) => {
			if (err) reject(err);

			Mailer.sendMail({
				from: `Joey ${process.env.COMPANY_EMAIL_ADDRESS}`,
				to:  user.email,
				subject: `Password reset request for ${user.name || user.email}.`,
				html: html,
				text: text
			}, (err, info) => {
				if (err) reject(err);
				else resolve(info);
			})
		})
	});

}
