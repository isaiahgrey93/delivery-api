'use strict';

const Stripe = require('stripe')(process.env.STRIPE_SECRET);
const Utils = require('../utils');

let defaults = {
  account: {
    managed: true,
    country: 'US',
    transfer_schedule: {
      monthly_anchor: 1,
      interval: 'monthly'
    }
  },
  transfer: {
    currency: 'usd'
  },
  charge: {
    currency: 'usd'
  }
}

module.exports.accounts = {
  create: (data) => {
    return Stripe.accounts.create(
      Object.assign(defaults.account, {
        email: data.email
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
    return Stripe.accounts.list({
      limit: limit
    })
  }
}


module.exports.charges = {
  create: (drive, payment) => {
    let charge = Object.assign(defaults.charge, {
      amount: drive.price,
      source: payment,
      description: `Payment for Joey drive <${drive.id}>`
    })

    return Stripe.charges.create(charge)
  }
}

module.exports.transfers = {
  create: (drive) => {
    let driver = Object.assign(defaults.transfer, {
      amount: Utils.stripe.getPayout('driver', drive.price),
      source_transaction: drive.payment.charge_id,
      destination: drive.driver.connect_id,
      description: `Driver <${drive.driver.id}> payment share for drive <${drive.id}>`
    })

    let kiosk = Object.assign(defaults.transfer, {
      amount: Utils.stripe.getPayout('kiosk', drive.price),
      source_transaction: drive.payment.charge_id,
      destination: drive.requester.connect_id,
      description: `Requester <${drive.requester.id}> payment share for drive <${drive.id}>`
    })
    
    let complete = [];

    return Stripe.transfers.create(driver)
      .then((res) => {
        complete.push(res);
        return Stripe.transfers.create(kiosk)
      })
      .then((res) => {
        complete.push(res);
        return complete;
      })
      .catch((err) => err)
  }
}

module.exports.refunds = {
  create: (drive) => {
    return Stripe.refunds.create({
      charge: drive.payment.charge_id
    })
    .then((refund) => {
      // cannot refund automatic transfers currently
      return refund;
    })
  }
}