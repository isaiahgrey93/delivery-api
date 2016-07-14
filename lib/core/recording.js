'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  getAll: () => {
    return ORM.models.Recording
      .getJoin()
  },
  findById: (id) => {
    return ORM.models.Recording
      .get(id)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No recording found with id: <${id}>`))
  },
  create: (recording) => {
    return recording
      .save(recording)
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while saving the recording.`))
  },
  update: (recording) => {
    return ORM.models.Recording
      .get(recording.id)
      .update(recording)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No recording found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while updating the recording with the id: <${recording.id}>.`))
  },
  remove: (id) => {
    return ORM.models.Recording
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No recording found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while removing the recording with the id: <${id}>.`))
  }
}