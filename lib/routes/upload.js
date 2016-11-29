'use strict';

const Joi = require('joi');
const uuid = require('uuid')

module.exports.create = {
    tags: ['api'],
    handler: function(request, reply) {
        let path = request.params.path;
        let file = request.payload.file;

        this.core.upload.create(path = uuid.v1(), file)
        .then((res) => reply(res))
        .catch((err) => reply(err))
    }
}

module.exports.fetch = {
    tags: ['api'],
    handler: function(request, reply) {
        const path = request.params.path;
        const file = this.core.upload.fetch(path);

        if (!request.headers.authorization) {
            reply.redirect(file);
        } else {
            reply(file);
        }

    }
}

module.exports.remove = {
    tags: ['api'],
    handler: function(request, reply) {
        let path = request.params.path;

        this.core.upload.remove(path)
        .then((res) => reply(res))
        .catch((err) => reply(err))
    }
}
