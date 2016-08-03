'use strict';

const ORM = require('thinky-loader')
const Boom = require('boom');
const Mailer = require('../plugins/mailer');
const SwigEmailTemplates = require('swig-email-templates');
const EmailTemplates = new SwigEmailTemplates({
	root: './lib/templates'
});

module.exports = {
	findByEmail: (email) => {
		return ORM.models.User
		.filter({ email: email })
		.limit(1)
		.then((users) => users.length > 0 ? users[0] : false)
	},
	sendResetPasswordLink: (user) => {
		let username = user.name || user.email;
		let token = user.password_reset.token;
		let email = user.email;

		return new Promise((resolve, reject) => {
			EmailTemplates.render('email/password_reset.html', {
				name: username,
				token: token
			}, (err, html, text) => {
				if (err) reject(err);

				Mailer.sendMail({
					from: `Joey ${process.env.COMPANY_EMAIL_ADDRESS}`,
					to: email,
					subject: `Password reset request for ${username}.`,
					html: html,
					text: text
				}, (err, info) => {
					if (err) reject(err);

					resolve(info);
				})
			})
		});

	}
}