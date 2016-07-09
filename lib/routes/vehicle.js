'use strict';

const Boom = require('boom');

module.exports.create = {
  auth: {
    scope: ['driver', 'admin']
  },
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.userId = request.auth.credentials.id;

    try {
      vehicle.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    vehicle.save()
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err))
  }
}


module.exports.update = {
  auth: {
    scope: ['driver', 'admin']
  },
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);

    try {
      vehicle.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    this.core.vehicle.update(vehicle)
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err))
  }
}