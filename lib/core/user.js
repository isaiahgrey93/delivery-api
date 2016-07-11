'use strict';

const ORM = require('thinky-loader')
const Boom = require('boom');
const JWT = require('jsonwebtoken');

module.exports = {
  getAll: () => {
    console.log(ORM.thinky.Errors)
    return ORM.Models.User
      .getJoin()
  },
  findById: (id) => {
    return ORM.Models.User
      .get(id)
      .getJoin()
      .then((user) => user)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
  },
  findByEmail: (email) => {
    return ORM.Models.User
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
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while saving the document.'))
  },
  update: (user) => {
    return ORM.Models.User
      .get(user.id)
      .update(user)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while updating the document.'))
  },
  remove: (id) => {
    return ORM.Models.User
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest('Value for [id] does not exist on any documents.'))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest('A write error occured while deleting the document.'))
  },
  sanitize: (user) => {
    delete user['password'];
    return user;
  },
  grantToken: (user) => {
    return JWT.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}