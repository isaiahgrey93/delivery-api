'use strict';

const Joi = require('joi');

module.exports.create = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        payload: Joi.object().keys({
            external_account: Joi.object().keys({
                account_holder_name: Joi.string().description('Bank Account Holder Name').example('Account Holder Name'),
                account_number: Joi.string().description('Bank Account Number').example('000123456789'),
                routing_number: Joi.string().description('Bank Account Routing Number)').example('110000000'),
            }).unknown()
        }).unknown().notes('Any keys from the Stripe Account API resource are allowed: https://stripe.com/docs/api/curl#create_account'),
        params: {
            user_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.user_id;
        let data = request.payload;

        this.core.model('User').findById(id)
        .then((user) => {
            data.email = user.email;
            return this.core.stripe.accounts.create(data)
        })
        .then((account) => this.core.model('User').update({ id: id, connect_id: account.id }))
        .then((user) => reply(this.utils.user.sanitize(user)))
        .catch((err) => reply(err))
    }
}

module.exports.update = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        payload: Joi.object().keys({
            external_account: Joi.object().keys({
                account_holder_name: Joi.string().description('Bank Account Holder Name').example('Account Holder Name'),
                account_number: Joi.string().description('Bank Account Number').example('000123456789'),
                routing_number: Joi.string().description('Bank Account Routing Number)').example('110000000'),
            }).unknown()
        }).unknown().notes('Any keys from the Stripe Account API resource are allowed: https://stripe.com/docs/api/curl#create_account'),
        params: {
            user_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.user_id;
        let data = request.payload;

        this.core.model('User').findById(id)
        .then((user) => this.utils.user.hasAccount(user))
        .then((user) => this.core.stripe.accounts.update(user.connect_id, data))
        .then((user) => reply(user))
        .catch((err) => reply(err))
    }
}

module.exports.remove = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            user_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.user_id;

        this.core.model('User').findById(id)
        .then((user) => this.utils.user.hasAccount(user))
        .then((user) => this.core.stripe.accounts.remove(user.connect_id))
        .then((account) => this.core.model('User').update({ id: id, connect_id : false }))
        .then((user) => reply(this.utils.user.sanitize(user)))
        .catch((err) => reply(err))
    }
}

module.exports.findById = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            user_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.user_id;
        let data = request.payload;

        this.core.model('User').findById(id)
        .then((user) => this.utils.user.hasAccount(user))
        .then((user) => this.core.stripe.accounts.getById(user.connect_id))
        .then((user) => reply(user))
        .catch((err) => reply(err))
    }
}

module.exports.getAll = {
    auth: {
        scope: ['admin']
    },
    validate: {
        query: {
            limit: Joi.string().optional()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let limit = request.params.limit;

        this.core.stripe.accounts.getAll(limit)
        .then((users) => reply(users))
        .catch((err) => reply(err))
    }
}
