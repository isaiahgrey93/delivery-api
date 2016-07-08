'use strict';

const Boom = require('boom');

module.exports.create = {
  handler: function(request, reply) {
    let preset = new this.db.models.Vehicle(request.payload);
    preset.userId = request.auth.credentials.id;

    try {
      preset.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    preset.save()
      .then((preset) => preset)
      .then((preset) => reply(preset))
      .catch((err) => console.log(err))

  }
}