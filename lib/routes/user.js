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
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            scope: Joi.array().required().items(
                Joi.string().valid(['driver', 'requester', 'admin']).required()
            ),
            firstname: Joi.string(),
            middle_initial: Joi.string(),
            lastname: Joi.string(),
            nickname: Joi.string(),
            profile_photo: Joi.any(),
            email: Joi.string().email(),
            phone: Joi.string(),
            dob: Joi.string(),
            rating: Joi.number(),
            drivers_license: Joi.object().keys({
                expiry_month: Joi.string(),
                expiry_year: Joi.string(),
                number: Joi.string(),
                photo: Joi.any(),
                state: Joi.string()
            }),
            address: {
                street: Joi.string(),
                city: Joi.string(),
                state: Joi.string(),
                zip: Joi.string()
            },
            status: Joi.string().valid('unverified', 'verified', 'rejected'),
            social_security_number: Joi.string()
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
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let credentials = request.payload;

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
            let account = this.utils.user.sanitize(res);
            let token = this.utils.user.grantJSONWebToken(account);

            account.token = token;

            reply(account)
            .header('Authorization', token);
        }
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
            firstname: Joi.string(),
            middle_initial: Joi.string(),
            lastname: Joi.string(),
            nickname: Joi.string(),
            profile_photo: Joi.any(),
            email: Joi.string().email(),
            phone: Joi.string(),
            dob: Joi.string(),
            rating: Joi.number(),
            drivers_license: Joi.object().keys({
                expiry_month: Joi.string(),
                expiry_year: Joi.string(),
                number: Joi.string(),
                photo: Joi.any(),
                state: Joi.string()
            }),
            address: {
                street: Joi.string(),
                city: Joi.string(),
                state: Joi.string(),
                zip: Joi.string()
            },
            status: Joi.string().valid('unverified', 'verified', 'rejected'),
            scope: Joi.array().items(Joi.string().valid('driver', 'requester', 'admin')),
            social_security_number: Joi.string()
        },
        params: {
            user_id: Joi.string().required()
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
            user_id: Joi.string().required()
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
            email: Joi.string().required()
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
            new: Joi.string().min(6).required()
        },
        params: {
            email: Joi.string().required(),
            token_id: Joi.string().required()
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
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            user_id: Joi.string().required()
        },
        query: {
            populate: Joi.string()
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

module.exports.getAll = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        query: {
            populate: Joi.string()
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
