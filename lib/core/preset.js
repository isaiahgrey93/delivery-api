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
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
  },
  create: (preset) => {
    return preset
      .save(preset)
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while saving the document.'))
  },
  update: (preset) => {
    return ORM.models.Preset
      .get(preset.id)
      .update(preset)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  },
  remove: (id) => {
    return ORM.models.Preset
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while removing the document.'))
  }
}