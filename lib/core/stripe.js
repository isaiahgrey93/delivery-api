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

module.exports.connect = {
  create: (data) => {
    return Stripe.accounts.create(
      Object.assign(defaults.connect, {
        email: data.email, 
      })
    )
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
    return Stripe.accounts.list(
      Object.assign(defaults.connect, {
        limit: limit, 
      })
    )
  }
}

module.exports.customer = {
  create: (data) => {
    return Stripe.customers.create(
      Object.assign(defaults.customer, {
        email: data.email, 
      })
    )
  },
  update: (id, data) => {
    return Stripe.customers.update(id, data)
  },
  remove: (id) => {
    return Stripe.customers.del(id)
  },
  getById: (id) => {
    return Stripe.customers.retrieve(id)
  },
  getAll: (limit) => {
    return Stripe.customers.list(
      Object.assign(defaults.customer, {
        limit: limit 
      })
    )
  }
}

module.exports.charge = {
  create: (data) => {
    return Stripe.charges.create(data)
  }
}