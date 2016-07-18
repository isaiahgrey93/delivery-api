'use strict';

const Joi = require('joi');
const PresetSchema = {
  name: Joi.string().description('Preset name.'),
  width: Joi.string().description('Preset width.'),
  height: Joi.string().description('Preset height.'),
  depth: Joi.string().description('Preset depth.'),
  weight: Joi.string().description('Preset weight.')
}

module.exports.create = {
  auth: {
    scope: ['requester', 'admin']
  },
  validate: {
    payload: PresetSchema
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.user_id = request.auth.credentials.id;

    this.utils.model.validate(preset);

    this.core.model('Preset').create(preset)
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
    payload: PresetSchema,
    params: {
      preset_id: Joi.string().required().description('Preset unique id.')
    }
  },
  handler: function(request, reply) {
    let preset = new this.db.models.Preset(request.payload);
    preset.id = request.params.preset_id;

    this.utils.model.validate(preset);

    this.core.model('Preset').update(preset)
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
    params: {
      preset_id: Joi.string().required().description('Preset unique id.')
    }
  },
  handler: function(request, reply) {
    let id = request.params.preset_id;
    
    this.core.model('Preset').remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      preset_id: Joi.string().required().description('Preset unique id.')
    }
  },
  handler: function(request, reply) {
    let id = request.params.preset_id;

    this.core.model('Preset').findById(id)
    .then((preset) => reply(preset))
    .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {

    this.core.model('Preset').getAll()
    .then((preset) => reply(preset))
    .catch((err) => reply(err));
  }
}