'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = {
  create: (preset) => {
    return preset
      .save(preset)
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
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  }
}