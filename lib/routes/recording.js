'use strict';

const Joi = require('joi');
const RecordingSchema = {
  url: Joi.string().required().description('Recording url.'),
  duration: Joi.number().required().description('Recording duration.'),
  drive_id: Joi.string().required().description('Drive id of recording.')
}

module.exports.create = {
  validate: {
    payload: RecordingSchema
  },
  tags: ['api'],
  handler: function(request, reply) {
    let recording = new this.db.models.Recording(request.payload);

    this.utils.model.validate(recording);

    this.core.model('Recording').create(recording)
      .then((recording) => reply(recording))
      .catch((err) => reply(err));
  }
}

module.exports.update = {
  auth: {
    scope: ['admin']
  },
  plugins : {
    policies: ['isAdminOrOwner']
  },
  validate: {
    payload: RecordingSchema,
    params: {
      recording_id: Joi.string().required().description('Recording unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let recording = new this.db.models.Recording(request.payload);
    recording.id = request.params.recording_id;

    this.utils.model.validate(recording);

    this.core.model('Recording').update(recording)
      .then((recording) => reply(recording))
      .catch((err) => reply(err));
  }
}

module.exports.remove = {
  auth: {
    scope: ['admin']
  },
  plugins : {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      recording_id: Joi.string().required().description('Recording unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let id = request.params.recording_id;
    
    this.core.model('Recording').remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));
  }
}

module.exports.getById = {
  auth: {
    scope: ['admin']
  },
  validate: {
    params: {
      recording_id: Joi.string().required().description('Recording unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let id = request.params.recording_id;
    
    this.core.model('Recording').findById(id)
    .then((recording) => reply(recording))
    .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  auth: {
    scope: ['admin']
  },
  tags: ['api'],
  handler: function(request, reply) {
    
    this.core.model('Recording').getAll()
    .then((recording) => reply(recording))
    .catch((err) => reply(err));
  }
}