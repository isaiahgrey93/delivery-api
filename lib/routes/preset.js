'use strict';

const Boom = require('boom');

module.exports.create = {
  auth: {
    scope: ['requester', 'admin']
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.userId = request.auth.credentials.id;

    this.core.common.validate(preset);

    this.core.preset.create(preset)
      .then((preset) => reply(preset))
      .catch((err) => reply(err));

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

    this.core.common.validate(preset);

    this.core.preset.update(preset)
      .then((preset) => reply(preset))
      .catch((err) => reply(err));

  }
}

module.exports.remove = {
  auth: {
    scope: ['requester', 'admin']
  },
  plugins : {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let id = request.params.preset_id;
    
    this.core.preset.remove(id)
      .then((preset) => reply(preset))
      .catch((err) => reply(err));

  }
}