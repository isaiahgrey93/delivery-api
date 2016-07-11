'use strict';

const Models = require('thinky-loader').models;
const Errors = require('thinky')().Errors;
const Boom = require('boom');

module.exports = {
  create: (preset) => {
    return preset
      .save(preset)
  },
  update: (preset) => {
    return Models.Preset
      .get(preset.id)
      .update(preset)
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  },
  remove: (id) => {
    return Models.Preset
      .get(id)
      .then((doc) => doc.purge())
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  }
}