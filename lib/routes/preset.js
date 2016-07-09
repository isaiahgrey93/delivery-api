'use strict';

const Boom = require('boom');

module.exports.create = {
  auth: {
    scope: ['requester', 'admin']
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.userId = request.auth.credentials.id;

    try {
      preset.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    preset.save()
      .then((preset) => reply(preset))
      .catch((err) => reply(err))

  }
}

module.exports.update = {
  auth: {
    scope: ['requester', 'admin']
  },
  plugins : {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);

    try {
      preset.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    this.core.preset.update(preset)
      .then((preset) => reply(preset))
      .catch((err) => reply(err))

  }
}