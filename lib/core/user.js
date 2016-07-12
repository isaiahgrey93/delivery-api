'use strict';

const ORM = require('thinky-loader')
const Boom = require('boom');
const JWT = require('jsonwebtoken');

module.exports = {
  getAll: () => {
    return ORM.models.User
      .getJoin()
  },
  findById: (id) => {
    return ORM.models.User
      .get(id)
      .getJoin()
      .then((user) => user)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No user found with id: <${id}>`))
  },
  findByEmail: (email) => {
    return ORM.models.User
      .filter({ email: email })
      .limit(1)
      .then((users) => {
        if (users.length > 0) return users[0]
        else throw Boom.badRequest(`Email <${email}> and password combination is incorrect.`);
      })
  },
  create: (user) => {
    return user
      .save()  
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while saving the user.`))
  },
  update: (user) => {
    return ORM.models.User
      .get(user.id)
      .update(user)
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No user found with id: <${user.id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while updating the user with the id: <${id}>.`))
  },
  remove: (id) => {
    return ORM.models.User
      .get(id)
      .then((doc) => doc.purge())
      .catch(ORM.thinky.Errors.DocumentNotFound, () => Boom.badRequest(`No user found with id: <${id}>`))
      .catch(ORM.thinky.Errors.InvalidWrite, () => Boom.badRequest(`An error occured while removing the user with the id: <${id}>.`))
  },
  sanitize: (data) => {
    if (data instanceof Array) {
      return data.map((user) => {
        delete user['password'];
        return user;
      })
    } else {
      delete data['password'];
      return data;
    };
  },
  grantToken: (user) => {
    return JWT.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}