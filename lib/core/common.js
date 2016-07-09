'use strict';

const Models = require('thinky-loader').models;
const Boom = require('boom');

module.exports = {
  validate: (model) => {
    try {
      model.validate();
    } catch (err) {
      throw Boom.badRequest(err.message);
    }
  }
}