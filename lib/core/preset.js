'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  getAll: () => {
    return ORM.models.Preset
      .getJoin()
  },
  findById: (id) => {
    return ORM.models.Preset
      .get(id)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No preset found with id: <${id}>`))
  },
  create: (preset) => {
    return preset
      .save(preset)
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while saving the preset.`))
  },
  update: (preset) => {
    return ORM.models.Preset
      .get(preset.id)
      .update(preset)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No preset found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while updating the preset with the id: <${preset.id}>.`))
  },
  remove: (id) => {
    return ORM.models.Preset
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No preset found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while removing the preset with the id: <${id}>.`))
  }
}