'use strict';

const Joi = require('joi');

module.exports.create = {
  validate: {
    payload: {
      price: Joi.number().positive().precision(2).description('Transport fee'),
      route: Joi.object().keys({
        origin: Joi.array().items(Joi.number()).length(2).description('GeoJSON Point of the drive origin'),
        destination: Joi.array().items(Joi.number()).length(2).description('GeoJSON Point of the drive destination'),
      }).description('Drive GeoJSON Points'),
      items: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().description('Name of item in transport'),
          height: Joi.string().description('Height of item in transport'),
          width: Joi.string().description('Width of item in transport'),
          depth: Joi.string().description('Depth of item in transport'),
          weight: Joi.string().description('Weight of item in transport'),
          images: Joi.array().items(Joi.string()).description('Images of item in transport')
        }).description('An item being transported')
      ).description('Collection of items being transported'),
      requester_id: Joi.string().description('Id of requester'),
      driver_id: Joi.string().description('Id of driver'),
    }
  },
  handler: function(request, reply) {
    let drive = new this.db.models.Drive(request.payload);
    drive.requester_id = drive.requester_id || request.auth.credentials.id;

    this.core.common.validate(drive);

    this.core.drive.create(drive)
      .then((drive) => reply(drive))
      .catch((err) => reply(err));
  }
}

module.exports.update = {
  validate: {
    payload: {
      price: Joi.number().positive().precision(2).description('Transport fee'),
      route: Joi.object().keys({
        origin: Joi.array().items(Joi.number()).length(2).description('GeoJSON Point of the drive origin'),
        destination: Joi.array().items(Joi.number()).length(2).description('GeoJSON Point of the drive destination'),
      }).description('Drive GeoJSON Points'),
      items: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().description('Name of item in transport'),
          height: Joi.string().description('Height of item in transport'),
          width: Joi.string().description('Width of item in transport'),
          depth: Joi.string().description('Depth of item in transport'),
          weight: Joi.string().description('Weight of item in transport'),
          images: Joi.array().items(Joi.string()).description('Images of item in transport')
        }).description('An item being transported')
      ).description('Collection of items being transported'),
      requester_id: Joi.string().description('Id of requester'),
      driver_id: Joi.string().description('Id of driver'),
    }
  },
  handler: function(request, reply) {
    let drive = new this.db.models.Drive(request.payload);
    drive.id = request.params.drive_id;

    this.core.common.validate(drive);

    this.core.drive.update(drive)
      .then((drive) => reply(drive))
      .catch((err) => reply(err));
  }
}

module.exports.remove = {
  plugins : {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      drive_id: Joi.string().required().description('Drive id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.drive_id;
    
    this.core.drive.remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  validate: {
    params: {
      drive_id: Joi.string().required().description('Drive id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.drive_id;

    this.core.drive.findById(id)
      .then((drive) => reply(drive))
      .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  handler: function(request, reply) {

    this.core.drive.getAll()
      .then((drive) => reply(drive))
      .catch((err) => reply(err));
  }
}