'use strict';

const Core = require('../core')
const uuid = require('uuid');
const _ = require('lodash');

module.exports = (key) => (request, reply) => {
  let upload = _.get(request.payload, key);
  // No action if image path is not defined.
  if (upload === undefined || upload === 'undefined') {
    _.unset(request.payload, key);
    reply(null);

  // No action if image path is defined as string uri.
  } else if (typeof upload !== 'object') {
    reply(null);
  } else {
  // Upload if buffer object is present at image path.
    Core.upload.create(uuid.v1(), upload)
      .then((image) => {

        _.unset(request.payload, key);
        _.set(request.payload, key, image.key);

        reply(image.key);
      })
      .catch((err) => {
        reply(null);
      })
  }
}
