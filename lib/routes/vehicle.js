'use strict';

const Joi = require('joi');
const VehicleSchema = {
  make: Joi.string().description('Vehicle make.'),
  model: Joi.string().description('Vehicle model.'),
  year: Joi.string().description('Vehicle year.'),
  class: Joi.string().description('Vehicle class.'),
  license: Joi.object().keys({
    number: Joi.string().description('License number.'),
    image: Joi.string().description('License image.'),
    expiration: Joi.string().description('License expiration.')
  }).description('Vehicle license.')
}

module.exports.create = {
  auth: {
    scope: ['driver', 'admin']
  },
  validate: {
    payload: VehicleSchema
  },
  tags: ['api'],
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.user_id = request.auth.credentials.id;

    this.utils.model.validate(vehicle);

    this.core.model('Vehicle').create(vehicle)
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
    payload: VehicleSchema,
    params: {
      vehicle_id: Joi.string().required().description('Vehicle unqiue id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let vehicle = new this.db.models.Vehicle(request.payload);
    vehicle.id = request.params.vehicle_id;

    this.utils.model.validate(vehicle);

    this.core.model('Vehicle').update(vehicle)
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
      vehicle_id: Joi.string().required().description('Vehicle unqiue id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let id = request.params.vehicle_id;
    
    this.core.model('Vehicle').remove(id)
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
      vehicle_id: Joi.string().required().description('Vehicle unqiue id.')
    }
  },
  handler: function(request, reply) {
    let id = request.params.vehicle_id;
    
    this.core.model('Vehicle').findById(id)
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  tags: ['api'],
  handler: function(request, reply) {
    
    this.core.model('Vehicle').getAll()
      .then((vehicle) => reply(vehicle))
      .catch((err) => reply(err));
  }
}