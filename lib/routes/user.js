'use strict';

module.exports.create = {
  auth: false,
  handler: function(request, reply) {
    let user = new this.db.models.User(request.payload);

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


// module.exports.login - {
//   auth: false,
//   handler: (request, replay)
// }