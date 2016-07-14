'use strict';

const ORM = require('thinky-loader')
const Boom = require('boom');
const JWT = require('jsonwebtoken');

module.exports = {
  findByEmail: (email) => {
    return ORM.models.User
      .filter({ email: email })
      .limit(1)
      .then((users) => users.length > 0 ? users[0] : false)
  },
  grantToken: (user) => {
    return JWT.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}