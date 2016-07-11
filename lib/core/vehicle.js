'use strict';

const Models = require('thinky-loader').models;
const Errors = require('thinky')().Errors;
const Boom = require('boom');

module.exports = {
  create: (vehicle) => {
    return vehicle
      .save()
  },
  update: (vehicle) => {
    return Models.Vehicle
      .get(vehicle.id)
      .update(vehicle)
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
  },
  remove: (id) => {
    return Models.Vehicle
      .get(id)
      .then((doc) => doc.purge())
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  }
}