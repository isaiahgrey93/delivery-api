'use strict';

const Boom = require('boom');

module.exports.create = {
  auth: false,
  handler: function(request, reply) {
    let user = new this.db.models.User(request.payload);

    try {
      user.validate();
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    user.generatePassword(user)
      .then((user) => user.save())
      .then((user) => {
        let account = this.core.user.sanitize(user);
        reply(account)
          .header('Authorization', this.core.user.grantToken(account))
      })
      .catch((err) => reply(err));
  }
};

module.exports.login = {
  auth: false,
  handler: function(request, reply) {
    let credentials = request.payload;

    this.core.user.findByEmail(credentials.email)
      .then((user) => {
        if(!user) throw Boom.unauthorized("Value for [email] is not registered to an existing account.");
        else return user.comparePassword(credentials.password);
      })
      .then((authedUser) => {
        if (!authedUser) throw Boom.unauthorized("Values for [email] and [password] combination is incorrect.");
        else {
          let account = this.core.user.sanitize(authedUser);
          reply(account)
            .header('Authorization', this.core.user.grantToken(account));
        }
      })
      .catch((err) => reply(err));
  }
}

module.exports.getUser = {
  handler: function(request, reply) {
    let id = request.params.user_id;
    let credentials = request.auth.credentials;

    if (credentials.scope !== 'admin' && credentials.id !== id) {
      return reply(Boom.unauthorized('Value for [scope] does not have the required permission.'));
    }

    this.core.user.findById(id)
      .then((user) => reply(this.core.user.sanitize(user)))
      .catch((err) => reply(err));
  }
}