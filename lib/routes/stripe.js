'use strict';

const Joi = require('joi');

module.exports.createCustomer = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: true,
    params: {
      user_id: Joi.string().required().description('User id')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;

    this.core.model('User').findById(id)
      .then((user) => this.core.stripe.customer.create(user))
      .then((customer) => ({
        id: id,
        stripe_id: customer.id
      }))
      .then((user) => this.core.model('User').update(user))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.updateCustomer = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: true,
    params: {
      user_id: Joi.string().required().description('User id')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let data = request.payload;
    
    this.core.model('User').findById(id)
      .then((user) => this.core.stripe.customer.update(user.stripe_id, data))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.removeCustomer = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User id')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    
    this.core.model('User').findById(id)
      .then((user) => this.core.stripe.customer.remove(user.stripe_id))
      .then((user) => this.core.model('User').update({ id: id, stripe_id: false }))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.getCustomer = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User id')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let data = request.payload;
    
    this.core.model('User').findById(id)
      .then((user) => this.core.stripe.customer.getById(user.stripe_id))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.getCustomerList = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    query: {
      limit: Joi.string().optional().description('Amount of customers to get')
    }
  },
  handler: function (request, reply) {
    let limit = request.params.limit;
    
    this.core.stripe.customer.getAll(limit)
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}