'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Prehandlers = require('../prehandlers');

const UserPrehandlers = [
  {
    assign: 'profile_photo',
    method: Prehandlers.upload('profile_photo'),
  },
  {
    assign: 'drivers_license.photo',
    method: Prehandlers.upload('drivers_license.photo'),
  }
]

module.exports.create = {
    tags: ['api'],
    auth: {
        mode: 'optional'
    },
    plugins : {
        policies: ['restrictAdminCreation']
    },
    validate: {
        payload: {
            email: Joi.string().email().required().description('User email address').example('user@mail.com'),
            password: Joi.string().min(6).required().description('User account password').example('password'),
            scope: Joi.array().required().items(
                Joi.string().valid(['driver', 'requester', 'admin']).required().description('User account role').example('driver')
            ),
            firstname: Joi.string().description('The firstname of the account user.').example('John'),
            middle_initial: Joi.string().description('The middle initial of the account user.').example('A'),
            lastname: Joi.string().description('The lastname of the account user.').example('Doe'),
            nickname: Joi.string().description('The nickanme of the account user.').example('Jo'),
            profile_photo: Joi.any().description('The unique id of the photo in S3').example('[UUID]'),
            phone: Joi.string().description('The phone number of the account').example('555-555-5555'),
            dob: Joi.string().description('The account user date of birth').example('12-15-78'),
            rating: Joi.number().description('The rating of a driver').notes('Applies to drivers only'),
            drivers_license: Joi.object().keys({
                expiry_month: Joi.string().description('Drivers license expiration month.').example('6'),
                expiry_year: Joi.string().description('Drivers license expiration year.').example('19'),
                number: Joi.string().description('Drivers license number.').example('8LK7 4K6'),
                photo: Joi.any().description('Drivers license photo.').example('[UUID]'),
                state: Joi.string().description('Drivers license issue state.').example('CA')
            }),
            address: {
                street: Joi.string().description('Street address').example('412 Washington'),
                city: Joi.string().description('Address City').example('Naples'),
                state: Joi.string().description('Address State').example('OR'),
                zip: Joi.string().description('Address postal code').example('55693')
            },
            status: Joi.string().valid('unverified', 'verified', 'rejected').description('User verification status').example('unverified'),
            social_security_number: Joi.string().description('User SSN').example('555-555-5555')
        }
    },
    pre: UserPrehandlers,
    handler: function(request, reply) {
        let user = new this.db.models.User(request.payload);

        this.utils.model.validate(user);

        this.core.model('User').create(user)
        .then((user) => {
            let account = this.utils.user.sanitize(user);
            let token = this.utils.user.grantJSONWebToken(account);

            account.token = token;

            reply(account)
            .header('Authorization', token)
        })
        .catch((err) => reply(err));
    }
};

module.exports.login = {
    auth: false,
    validate: {
        query: {
            populate: Joi.string().description('User relations to populate').example('?populate=vehicle')
        },
        payload: {
            email: Joi.string().email().required().description('User\'s account email.').example('user@mail.com'),
            password: Joi.string().min(6).required().description('User\'s account password.').example('123123'),
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let credentials = request.payload;
        let relations = request.query.populate;
        
        this.core.user.findByEmail(credentials.email)
            .then((user) => (
                !user
                ? Boom.badRequest(`Email <${credentials.email}> and password combination is incorrect.`)
                : user.comparePassword(credentials.password)
            )
        )
        .then((res) => {
            if (res.isBoom) return reply(res);
            else {
                return this.core.model('User').findById(res.id, {
                    populate: this.utils.model.populate(relations),
                    without: {
                        password: true
                    }
                })
            }
        })
        .then((user) => {
            let account = this.utils.user.sanitize(user);
            let token = this.utils.user.grantJSONWebToken(account);

            account.token = token;

            reply(account)
            .header('Authorization', token);
        })
        .catch((err) => reply(err));
    }
};

module.exports.update = {
    tags: ['api'],
    plugins : {
        policies: ['isAdminOrOwner', 'restrictAdminFields']
    },
    validate: {
        payload: {
            email: Joi.string().email().description('User email address').example('user@mail.com'),
            firstname: Joi.string().description('The firstname of the account user.').example('John'),
            middle_initial: Joi.string().description('The middle initial of the account user.').example('A'),
            lastname: Joi.string().description('The lastname of the account user.').example('Doe'),
            nickname: Joi.string().description('The nickanme of the account user.').example('Jo'),
            profile_photo: Joi.any().description('The unique id of the photo in S3').example('[UUID]'),
            phone: Joi.string().description('The phone number of the account').example('555-555-5555'),
            dob: Joi.string().description('The account user date of birth').example('12-15-78'),
            rating: Joi.number().description('The rating of a driver').notes('Applies to drivers only'),
            drivers_license: Joi.object().keys({
                expiry_month: Joi.string().description('Drivers license expiration month.').example('6'),
                expiry_year: Joi.string().description('Drivers license expiration year.').example('19'),
                number: Joi.string().description('Drivers license number.').example('8LK7 4K6'),
                photo: Joi.any().description('Drivers license photo.').example('[UUID]'),
                state: Joi.string().description('Drivers license issue state.').example('CA')
            }),
            address: {
                street: Joi.string().description('Street address').example('412 Washington'),
                city: Joi.string().description('Address City').example('Naples'),
                state: Joi.string().description('Address State').example('OR'),
                zip: Joi.string().description('Address postal code').example('55693')
            },
            status: Joi.string().valid('unverified', 'verified', 'rejected').description('User verification status').example('unverified'),
            scope: Joi.array().items(
                Joi.string().valid(['driver', 'requester', 'admin']).required().description('User account role').example('driver')
            ),
            social_security_number: Joi.string().description('User SSN').example('555-555-5555')
        },
        params: {
            user_id: Joi.string().required().description('Unqiue id of the user to update.').example('[UUID]')
        }
    },
    pre: UserPrehandlers,
    handler: function(request, reply) {
        let user = request.payload;
        user.id = request.params.user_id;

        this.core.model('User').update(user)
        .then((user) => this.utils.user.sanitize(user))
        .then((user) => reply(user))
        .catch((err) => reply(err));

    }
};

module.exports.remove = {
    auth: {
        scope: ['admin']
    },
    validate: {
        params: {
           user_id: Joi.string().required().description('Unqiue id of the user to remove.').example('[UUID]')
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.user_id;

        this.core.model('User').remove(id)
        .then((user) => this.utils.user.sanitize(user))
        .then((user) => reply(user))
        .catch((err) => reply(err));

    }
}

module.exports.password_reset_request = {
    auth: {
        mode: 'optional'
    },
    validate: {
        params: {
            email: Joi.string().required().description('Email address of the requested password reset.')
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let email = request.params.email;

        this.core.user.findByEmail(email)
        .then((user) => {
            if (!user) throw Boom.badRequest(`Email <${email}> is not registered to an account.`);
            console.log(user)
            user.password_reset = this.utils.user.generatePasswordResetToken();
            return this.core.model('User').update(user)
        })
        .then((user) => this.core.user.sendResetPasswordLink(user))
        .then((info) => reply(info))
        .catch((err) => reply(err));

    }
}

module.exports.reset_password = {
    auth: {
        mode: 'optional'
    },
    validate: {
        payload: {
            new: Joi.string().min(6).required().description('New password to be set in reset password.')
        },
        params: {
            email: Joi.string().required().description('Email address of the requested password reset.'),
            token_id: Joi.string().required().description('Auth token to reset password.')
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let email = request.params.email;
        let token = request.params.token_id;
        let new_password = request.payload.new;

        this.core.user.findByEmail(email)
        .then((user) => {
            if (!user || user.password_reset.token !== token) throw Boom.badRequest(`Token <${token}> is invalid.`);
            else return this.utils.user.validatePasswordResetToken(user);
        })
        .then((data) => {
            let user = new this.db.models.User(
                Object.assign(data, {
                    password_reset: {
                        expiry: new Date().toISOString()
                    },
                    password: new_password
                })
            );

            return user.generatePassword();
        })
        .then((user) => this.core.model('User').update(user))
        .then((user) => reply(this.utils.user.sanitize(user)))
        .catch((err) => reply(err));

    }
}

module.exports.getById = {
    validate: {
        params: {
            user_id: Joi.string().required().description('Unqiue id of the user to remove.').example('[UUID]')
        },
        query: {
            populate: Joi.string().description('Option to populate user relationships. Options: ["vehicle", "categories"]')
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.user_id;
        let relations = request.query.populate;

        this.core.model('User').findById(id, {
            populate: this.utils.model.populate(relations),
            without: {
                password: true
            }
        })
        .then((user) => reply(this.utils.user.sanitize(user)))
        .catch((err) => reply(err));
    }
};

module.exports.getByRole = {
    auth: {
        scope: ['admin']
    },
    validate: {
        query: {
            populate: Joi.string().description('Option to populate user relationships. Options: ["vehicle", "categories"]')
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let role = request.params.user_role;
        let relations = request.query.populate;

        this.core.user.findByRole(role, {
            populate: this.utils.model.populate(relations),
            without: {
                password: true
            }
        })
        .then((users) => reply(this.utils.user.sanitize(users)))
        .catch((err) => reply(err));
    }
};

module.exports.getAll = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        query: {
            populate: Joi.string().description('Option to populate user relationships. Options: ["vehicle", "categories"]')
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let relations = request.query.populate;

        this.core.model('User').getAll({
            populate: this.utils.model.populate(relations),
            without: {
                password: true
            }
        })
        .then((users) => reply(this.utils.user.sanitize(users)))
        .catch((err) => reply(err));
    }
};
