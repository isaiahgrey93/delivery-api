'use strict';

const Joi = require('joi');

module.exports.create = {
  auth: {
    scope: ['requester', 'admin']
  },
  validate: {
    payload: {
      name: Joi.string().required().description('Preset Name'),
      width: Joi.string().required().description('Preset Width'),
      height: Joi.string().required().description('Preset Height'),
      depth: Joi.string().required().description('Preset Depth'),
      weight: Joi.string().required().description('Preset Weight'),
    }
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.user_id = request.auth.credentials.id;

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
  validate: {
    payload: {
      name: Joi.string().optional().description('Preset Name'),
      width: Joi.string().optional().description('Preset Width'),
      height: Joi.string().optional().description('Preset Height'),
      depth: Joi.string().optional().description('Preset Depth'),
      weight: Joi.string().optional().description('Preset Weight'),
    },
    query: {
      preset_id: Joi.string().required().description('Preset Id')
    }
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.id = request.params.preset_id;

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
  validate: {
    query: {
      preset_id: Joi.string().required().description('Preset Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.preset_id;
    
    this.core.preset.remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    query: {
      preset_id: Joi.string().required().description('Preset Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.preset_id;

    this.core.preset.findById(id)
      .then((preset) => reply(preset))
      .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {

    this.core.preset.getAll()
      .then((preset) => reply(preset))
      .catch((err) => reply(err));
  }
}