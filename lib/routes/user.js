'use strict';

const User = require('../models/user');

module.exports.create = {
  handler: (request, reply) => {
    let user = new User(request.payload)

    try {
      user.validate()
    } catch (err) {
      return reply(JSON.stringify(err)).code(500)
    }
    
    return user.generatePassword()
      .then((user) => user.save())
      .then((user) => reply(user))
      .catch((err) => reply(JSON.stringify(err)).code(500))
  }
}