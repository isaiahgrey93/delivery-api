'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  create: (vehicle) => {
    return vehicle
      .save()
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while saving the document.'))
  },
  update: (vehicle) => {
    return ORM.models.Vehicle
      .get(vehicle.id)
      .update(vehicle)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
  },
  remove: (id) => {
    return ORM.models.Vehicle
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  }
}