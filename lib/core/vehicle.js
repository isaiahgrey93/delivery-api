'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  getAll: () => {
    return ORM.models.Vehicle
      .getJoin()
  },
  findById: (id) => {
    return ORM.models.Vehicle
      .get(id)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No vehicle found with id: <${id}>`))
  },
  create: (vehicle) => {
    return vehicle
      .save()
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while saving the vehicle.`))
  },
  update: (vehicle) => {
    return ORM.models.Vehicle
      .get(vehicle.id)
      .update(vehicle)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No vehicle found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while updating the vehicle with the id: <${vehicle.id}>.`))
  },
  remove: (id) => {
    return ORM.models.Vehicle
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No vehicle found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while removing the vehicle with the id: <${id}>.`))
  }
}