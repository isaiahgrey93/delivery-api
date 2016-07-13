'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  getAll: () => {
    return ORM.models.Drive
      .getJoin()
  },
  findById: (id) => {
    return ORM.models.Drive
      .get(id)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No drive found with id: <${id}>`))
  },
  create: (drive) => {
    return drive
      .save(drive)
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while saving the drive.`))
  },
  update: (drive) => {
    return ORM.models.Drive
      .get(drive.id)
      .update(drive)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No drive found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while updating the drive with the id: <${drive.id}>.`))
  },
  remove: (id) => {
    return ORM.models.Drive
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No drive found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while removing the drive with the id: <${id}>.`))
  }
}