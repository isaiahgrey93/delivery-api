'use strict';

const Stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports.customer = {
  create: (data) => {
    return Stripe.accounts.create({
      managed: true,
      country: data.country || 'US',
      email: data.email,
    });
  },
  update: (id, data) => {
    return Stripe.accounts.update(id, data)
  },
  remove: (id) => {
    return Stripe.accounts.del(id)
  },
  getById: (id) => {
    return Stripe.accounts.retrieve(id)
  },
  getAll: (limit) => {
    return Stripe.accounts.list({
      limit: limit
    })
  }
}