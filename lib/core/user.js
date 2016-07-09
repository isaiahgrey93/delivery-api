'use strict';

const Models = require('thinky-loader').models;
const Jwt = require('jsonwebtoken');

module.exports = {
  getAll: () => {
    return Models.User
      .getJoin()
      .run()
      .then((users) => users)
      .catch((err) => err);
  },
  findById: (id) => {
    return Models.User.get(id)
      .getJoin()
      .run()
      .then((user) => user)
      .catch((err) => err);
  },
  findByEmail: (email) => {
    return Models.User.filter({ email: email })
      .run()
      .then((users) => users[0])
      .catch((err) => err);
  },
  create: (user) => {
    return user.generatePassword(user)
      .then((user) => user.save())
      .catch((err) => err);
  },
  update: (user) => {
    return Models.User.get(user.id)
      .update(user)
      .then((user) => user)
      .catch((err) => err);
  },
  sanitize: (user) => {
    delete user['password'];
    return user;
  },
  grantToken: (user) => {
    return Jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}