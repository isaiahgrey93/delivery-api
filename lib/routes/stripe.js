'use strict';

const Joi = require('joi');

module.exports.create = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: true,
    params: {
      user_id: Joi.string().required().description('User unique id.')
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
    payload: true,
    params: {
      user_id: Joi.string().required().description('User unique id.')
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
      user_id: Joi.string().required().description('User unique id.')
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
      user_id: Joi.string().required().description('User unique id.')
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
      limit: Joi.string().optional().description('Number of Stripe accounts to get.')
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