'use strict';

module.exports = {
  plugins: {
    policies: ['isOwnerOrAdmin']
  },
  createCustomer: {
    handler: function (request, reply) {
      let id = request.params.user_id;
      let data = request.payload;

      this.core.user.findById(id)
        .then((user) => this.core.stripe.createCustomer(Object.assign(user, data)))
        .then((customer) => ({
          id: user_id,
          stripe_id: customer.id
        }))
        .then((user) => this.core.user.update(user))
        .then((user) => reply(user))
        .catch((err) => reply(err))
    }
  }
}