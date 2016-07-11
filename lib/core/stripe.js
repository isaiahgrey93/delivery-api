'use strict';

const Stripe = require('stripe')(process.env.STRIPE_SECRET);
  
module.exports = {
  createCustomer: (user) => {
    return Stripe.customers.create({
      email: user.email
    });
  }
}