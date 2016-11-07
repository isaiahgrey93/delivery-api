'use strict';

const Joi = require('joi');
const Prehandlers = require ('../prehandlers')

const PresetSchema = {
    name: Joi.string(),
    width: Joi.string(),
    height: Joi.string(),
    depth: Joi.string(),
    weight: Joi.string(),
    image: Joi.any(),
    category_id: Joi.string().required(),
}

const PresetPrehandlers = [
  {
    assign: 'image',
    method: Prehandlers.upload('image'),
  },
]

module.exports.create = {
    auth: {
        scope: ['requester', 'admin']
    },
    validate: {
        payload: PresetSchema
    },
    tags: ['api'],
    pre: PresetPrehandlers,
    handler: function(request, reply) {
        let preset = new this.db.models.Preset(request.payload);

        this.utils.model.validate(preset);

        this.core.model('Preset').create(preset)
        .then((preset) => reply(preset))
        .catch((err) => reply(err));
    }
}

module.exports.update = {
    tags: ['api'],
    auth: {
        scope: ['requester', 'admin']
    },
    validate: {
        payload: PresetSchema,
        params: {
            preset_id: Joi.string().required()
        }
    },
    pre: PresetPrehandlers,
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
    validate: {
        params: {
            preset_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.preset_id;

        this.core.model('Preset').remove(id)
        .then((res) => reply(res))
        .catch((err) => reply(err));
    }
}

module.exports.getById = {
    validate: {
        params: {
            preset_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.preset_id;

        this.core.model('Preset').findById(id)
        .then((preset) => reply(preset))
        .catch((err) => reply(err));
    }
}

module.exports.getAll = {
    tags: ['api'],
    handler: function(request, reply) {

        this.core.model('Preset').getAll()
        .then((preset) => reply(preset))
        .catch((err) => reply(err));
    }
}
