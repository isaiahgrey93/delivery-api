'use strict';

const Joi = require('joi');

module.exports.create = {
  auth: {
    scope: ['driver', 'admin']
  },
  validate: {
    payload: {
      make: Joi.string().required().description('Vehicle make'),
      model: Joi.string().required().description('Vehicle model'),
      year: Joi.string().required().description('Vehicle year'),
      class: Joi.string().required().description('Vehicle class'),
      license: Joi.object().keys({
        number: Joi.string().required().description('License number'),
        image: Joi.string().required().description('License image'),
        expiration: Joi.string().required().description('License expiration')
      }).required().description('Vehicle license')
    }
  },
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.user_id = request.auth.credentials.id;

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
  validate: {
    payload: {
      make: Joi.string().optional().description('Vehicle Make'),
      model: Joi.string().optional().description('Vehicle Model'),
      year: Joi.string().optional().description('Vehicle Year'),
      class: Joi.string().optional().description('Vehicle Class'),
      license: Joi.object().keys({
        number: Joi.string().optional().description('License Number'),
        image: Joi.string().optional().description('License Image'),
        expiration: Joi.string().optional().description('License Expiration')
      }).optional().description('Vehicle License')
    },
    params: {
      vehicle_id: Joi.string().required().description('Vehicle Id')
    }
  },
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.id = request.params.vehicle_id;

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
  validate: {
    params: {
      vehicle_id: Joi.string().required().description('Vehicle Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.vehicle_id;
    
    this.core.vehicle.remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      vehicle_id: Joi.string().required().description('Vehicle Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.vehicle_id;

    this.core.vehicle.findById(id)
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {

    this.core.vehicle.getAll()
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err));
  }
}