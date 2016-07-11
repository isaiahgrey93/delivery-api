'use strict';

const Boom = require('boom');

module.exports.create = {
  auth: {
    scope: ['driver', 'admin']
  },
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.userId = request.auth.credentials.id;

    this.core.common.validate(vehicle);

    this.core.vehicle.create(vehicle)
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

    this.core.common.validate(vehicle);

    this.core.vehicle.update(vehicle)
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err))
  }
}

module.exports.remove = {
  auth: {
    scope: ['driver', 'admin']
  },
  plugins : {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let id = request.params.vehicle_id;
    
    this.core.vehicle.remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));

  }
}