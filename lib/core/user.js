'use strict';

const Models = require('thinky-loader').models;
const Jwt = require('jsonwebtoken');

module.exports = {
  getAll: () => {
    return Models.User
      .getJoin()
      .run()
  },
  findById: (id) => {
    return Models.User.get(id)
      .getJoin()
      .run()
  },
  findByEmail: (email) => {
    return Models.User.filter({ email: email })
      .limit(1)
      .run()
      .then((users) => users[0])
  },
  create: (user) => {
    return user.save()
  },
  update: (user) => {
    return Models.User.get(user.id)
      .update(user)
  },
  sanitize: (user) => {
    delete user['password'];
    return user;
  },
  grantToken: (user) => {
    return Jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}