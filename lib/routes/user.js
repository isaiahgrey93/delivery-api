'use strict';

module.exports.create = {
  handler: (request, reply) => {
    let User = request.server.plugins.orm.thinky.models.User;
    let user = new User(request.payload);

    try {
      user.validate();
    } catch (err) {
      return reply(JSON.stringify(err));
    }

    return user.generatePassword(user)
      .then((user) => user.save())
      .then((user) => reply(user))
      .catch((err) => reply(err));
  }
};
