'use strict';

const Joi = require('joi');

module.exports.create = {
  validate: {
    payload: {
      url: Joi.string().required().description('Recording url'),
      duration: Joi.number().required().description('Recording duration'),
      drive_id: Joi.string().required().description('Drive id of recording')
    }
  },
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
    payload: {
      url: Joi.string().required().description('Recording url'),
      duration: Joi.number().required().description('Recording duration'),
      drive_id: Joi.string().required().description('Drive id of recording')
    },
    params: {
      recording_id: Joi.string().required().description('Recording id')
    }
  },
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
      recording_id: Joi.string().required().description('Recording id')
    }
  },
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
      recording_id: Joi.string().required().description('Recording id')
    },
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.')
    }
  },
  handler: function(request, reply) {
    let id = request.params.recording_id;
    let options = request.query.populate;
    
    this.core.model('Recording').findById(id, this.utils.model.populate(options))
      .then((recording) => reply(recording))
      .catch((err) => reply(err));
  }
}

module.exports.getAll = {
  auth: {
    scope: ['admin']
  },
  validate: {
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.')
    }
  },
  handler: function(request, reply) {
    let options = request.query.populate;
    
    this.core.model('Recording').getAll(this.utils.model.populate(options))
      .then((recording) => reply(recording))
      .catch((err) => reply(err));
  }
}