'use strict';

const Joi = require('joi');

module.exports.create = {
  validate: {
    payload: {
      price: Joi.number().positive().precision(2).description('Drive Fee Amount'),
      route: Joi.object().keys({
        origin: Joi.object().keys({
          street: Joi.string().description('Route origin street'),
          city: Joi.string().description('Route origin city'),
          state: Joi.string().description('Route origin state'),
          country: Joi.string().description('Route origin country'),
          postal_code: Joi.string().description('Route origin postal code')
        }).description('Route starting address'),
        destination: Joi.object().keys({
          street: Joi.string().description('Route destination postal code'),
          city: Joi.string().description('Route destination postal code'),
          state: Joi.string().description('Route destination postal code'),
          country: Joi.string().description('Route destination postal code'),
          postal_code: Joi.string().description('Route destination postal code')
        }).description('Route ending address'),
      }).description('Drive starting and ending addresses'),
      items: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().description('Item name'),
          height: Joi.number().description('Item height'),
          width: Joi.number().description('Item width'),
          depth: Joi.number().description('Item depth'),
          weight: Joi.number().description('Item weight'),
          images: Joi.array().items(Joi.string()).description('Item images')
        }).description('Item in drive')
      ).description('Collection of items in drive'),
      support: Joi.object().keys({
        driver_ext: Joi.string().description('Driver phone number'),
        requester_ext: Joi.string().description('Requester phone number')
      }).description('Support phone numbers'),
      requester_id: Joi.string().description('Drive requester\'s id'),
      driver_id: Joi.string().description('Drive driver\'s id'),
    }
  },
  handler: function(request, reply) {
    let drive = new this.db.models.Drive(request.payload);
    drive.requester_id = drive.requester_id || request.auth.credentials.id;

    this.utils.model.validate(drive);

    this.core.model('Drive').create(drive)
      .then((drive) => reply(drive))
      .catch((err) => reply(err));
  }
}

module.exports.update = {
  validate: {
    payload: {
      price: Joi.number().positive().precision(2).description('Drive Fee Amount'),
      route: Joi.object().keys({
        origin: Joi.object().keys({
          street: Joi.string().description('Route origin street'),
          city: Joi.string().description('Route origin city'),
          state: Joi.string().description('Route origin state'),
          country: Joi.string().description('Route origin country'),
          postal_code: Joi.string().description('Route origin postal code')
        }).description('Route starting address'),
        destination: Joi.object().keys({
          street: Joi.string().description('Route destination postal code'),
          city: Joi.string().description('Route destination postal code'),
          state: Joi.string().description('Route destination postal code'),
          country: Joi.string().description('Route destination postal code'),
          postal_code: Joi.string().description('Route destination postal code')
        }).description('Route ending address'),
      }).description('Drive starting and ending addresses'),
      items: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().description('Item name'),
          height: Joi.number().description('Item height'),
          width: Joi.number().description('Item width'),
          depth: Joi.number().description('Item depth'),
          weight: Joi.number().description('Item weight'),
          images: Joi.array().items(Joi.string()).description('Item images')
        }).description('Item in drive')
      ).description('Collection of items in drive'),
      support: Joi.object().keys({
        driver_ext: Joi.string().description('Driver phone number'),
        requester_ext: Joi.string().description('Requester phone number')
      }).description('Support phone numbers'),
      requester_id: Joi.string().description('Drive requester\'s id'),
      driver_id: Joi.string().description('Drive driver\'s id'),
    }
  },
  handler: function(request, reply) {
    let drive = new this.db.models.Drive(request.payload);
    drive.id = request.params.drive_id;

    this.utils.model.validate(drive);

    this.core.model('Drive').update(drive)
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
    
    this.core.model('Drive').remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  validate: {
    params: {
      drive_id: Joi.string().required().description('Drive id')
    },
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.')
    }
  },
  handler: function(request, reply) {
    let id = request.params.drive_id;
    let relations = request.query.populate;

    this.core.model('Drive').findById(id, {
      populate: this.utils.model.populate(relations)
    })
    .then((drive) => reply(drive))
    .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  auth: false,
  validate: {
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.')
    }
  },
  handler: function(request, reply) {
    let relations = request.query.populate;

    this.core.model('Drive').getAll({
      populate: this.utils.model.populate(relations)
    })
    .then((drive) => reply(drive))
    .catch((err) => reply(err));
  }
}