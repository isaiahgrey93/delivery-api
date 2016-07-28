'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

module.exports = (model_type) => ({
  getAll: (options) => {
    if (!options) options = {};
    return ORM.models[model_type]
      .withoutFields(options.without)
      .getJoin(options.populate)
  },
  findById: (id, options) => {
    if (!options) options = {};
    return ORM.models[model_type]
      .get(id)
      .withoutFields(options.without)
      .getJoin(options.populate)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => { throw Boom.badRequest(`No ${model_type} found with id: <${id}>`) })
  },
  create: (model) => {
    return model
      .save(model)
      .catch(ORM.thinky.Errors.InvalidWrite, () => { throw Boom.badRequest(`An error occured while saving the ${model_type}.`) })
  },
  update: (model) => {
    return ORM.models[model_type]
      .get(model.id)
      .update(model)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => { throw Boom.badRequest(`No ${model_type} found with id: <${model.id}>`) })
      .catch(ORM.thinky.Errors.InvalidWrite, () => { throw Boom.badRequest(`An error occured while updating the ${model_type} with the id: <${model.id}>.`) })
  },
  remove: (id) => {
    return ORM.models[model_type]
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => { throw Boom.badRequest(`No ${model_type} found with id: <${id}>`) })
      .catch(ORM.thinky.Errors.InvalidWrite, () => { throw Boom.badRequest(`An error occured while removing the ${model_type} with the id: <${id}>.`) })
  }
})