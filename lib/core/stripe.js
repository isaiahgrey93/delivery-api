'use strict';

const Stripe = require('stripe')(process.env.STRIPE_SECRET);
let defaults = {
  connect: {
    managed: true,
    country: 'US',
    transfer_schedule: {
      monthly_anchor: 1,
      interval: 'monthly'
    }
  },
  customer: {}
}

module.exports.accounts = (account_type) => {
  let resource = account_type === 'connect' ? 'accounts' : 'customers';
  return {
    create: (data) => {
      return Stripe[resource].create(
        Object.assign(defaults[account_type], {
          email: data.email,
        })
      )
    },
    update: (id, data) => {
      return Stripe[resource].update(id, data)
    },
    remove: (id) => {
      return Stripe[resource].del(id)
    },
    getById: (id) => {
      return Stripe[resource].retrieve(id)
    },
    getAll: (limit) => {
      return Stripe[resource].list({
        limit: limit
      })
    }
  }
}


module.exports.charge = {
  create: (data) => {
    return Stripe.charges.create(data)
  }
}