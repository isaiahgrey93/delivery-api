'use strict';

const Joi = require('joi');

module.exports.createAccount = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: true,
    params: {
      user_id: Joi.string().required().description('User id'),
      account_type: Joi.string().valid('requester', 'driver').required().description('User account type.')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let account_type = this.utils.stripe.accountType(request.params.account_type);

    this.core.model('User').findById(id)
      .then((user) => this.core.stripe.accounts(account_type).create(user))
      .then((account) => {
        let data = { id: id };
        data[`${account_type}_id`] = account.id;

        return data;
      })
      .then((user) => this.core.model('User').update(user))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.updateAccount = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: true,
    params: {
      user_id: Joi.string().required().description('User id'),
      account_type: Joi.string().valid('requester', 'driver').required().description('User account type.')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let data = request.payload;
    let account_type = this.utils.stripe.accountType(request.params.account_type);
    
    this.core.model('User').findById(id)
      .then((user) => this.utils.user.hasAccount(user, account_type))
      .then((user) => this.core.stripe.accounts(account_type).update(user[`${account_type}_id`], data))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.removeAccount = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User id'),
      account_type: Joi.string().valid('requester', 'driver').required().description('User account type.')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let account_type = this.utils.stripe.accountType(request.params.account_type);
    
    this.core.model('User').findById(id)
      .then((user) => this.utils.user.hasAccount(user, account_type))
      .then((user) => this.core.stripe.accounts(account_type).remove(user[`${account_type}_id`]))
      .then((account) => {
        let data = { id: id };
        data[`${account_type}_id`] = false;

        return this.core.model('User').update(data);
      })
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.getAccount = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User id'),
      account_type: Joi.string().valid('requester', 'driver').required().description('User account type.')
    }
  },
  handler: function (request, reply) {
    let id = request.params.user_id;
    let data = request.payload;
    let account_type = this.utils.stripe.accountType(request.params.account_type);
    
    this.core.model('User').findById(id)
      .then((user) => this.utils.user.hasAccount(user, account_type))
      .then((user) => this.core.stripe.accounts(account_type).getById(user[`${account_type}_id`]))
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.getAccountList = {
  auth: {
    scope: ['admin']
  },
  validate: {
    query: {
      limit: Joi.string().optional().description('Amount of accounts to get')
    },
    params: {
      account_type: Joi.string().valid('requester', 'driver').required().description('User account type.')
    }
  },
  handler: function (request, reply) {
    let limit = request.params.limit;
    let account_type = this.utils.stripe.accountType(request.params.account_type);
    
    this.core.stripe.accounts(account_type).getAll(limit)
      .then((user) => reply(user))
      .catch((err) => reply(err))
  }
}

module.exports.createCharge = {
  validate: {
    payload: {
      amount: Joi.number().required().description('Fee amout for ride.'),
      source: Joi.string().required().description('Stripe account id of user to charge fee amout to'),
      destination: Joi.string().required().description('Stripe account id of user to transfer charge to'),
      currency: Joi.string().required().description('Transaction fee currency format'),
      description: Joi.string().description('Description of what the charge is for'),
      statement_descriptor: Joi.string().max(22).replace(/[<>"']/gi, '').description('An arbitrary string to be displayed on the chargee\'s card')
    }
  },
  handler: function (request, reply) {
    let data = request.payload;

    this.core.stripe.charge.create(data)
      .then((res) => reply(res))
      .catch((err) => reply(err))
  }
}