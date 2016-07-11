'use strict';

const Models = require('thinky-loader').models;
const Errors = require('thinky')().Errors;
const Boom = require('boom');
const Jwt = require('jsonwebtoken');

module.exports = {
  getAll: () => {
    return Models.User
      .getJoin()
  },
  findById: (id) => {
    return Models.User
      .get(id)
      .getJoin()
      .then((user) => user)
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
  },
  findByEmail: (email) => {
    return Models.User
      .filter({ email: email })
      .limit(1)
      .then((users) => {
        if (users.length > 0) return users[0];
        else throw Boom.badRequest('Value for [email] is not registered to an existing account.')
      })
  },
  create: (user) => {
    return user
      .save()  
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while saving the document.'))
  },
  update: (user) => {
    return Models.User
      .get(user.id)
      .update(user)
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  },
  remove: (id) => {
    return Models.User
      .get(id)
      .then((doc) => doc.purge())
      .catch(Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(Errors.InvalidWrite, () => Boom.badRequest('A write error occured while deleting the document.'))
  },
  sanitize: (user) => {
    delete user['password'];
    return user;
  },
  grantToken: (user) => {
    return Jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}