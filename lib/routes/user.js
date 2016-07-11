'use strict';

module.exports.create = {
  auth: false,
  handler: function(request, reply) {
    let user = new this.db.models.User(request.payload);

    this.core.common.validate(user);

    this.core.user.create(user)
      .then((user) => {
        let account = this.core.user.sanitize(user)
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
      .then((user) => user.comparePassword(credentials.password))
      .then((res) => {
        if (res.isBoom) return reply(res);
        else {
          let account = this.core.user.sanitize(res);
          reply(account)
            .header('Authorization', this.core.user.grantToken(account));
        }
      })
      .catch((err) => reply(err));
  }
};

module.exports.update = {
  plugins : {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let user = request.payload;
    user.id = request.params.user_id;

    this.core.user.update(user)
      .then((user) => reply(this.core.user.sanitize(user)))
      .catch((err) => reply(err));

  }
};

module.exports.remove = {
  auth: {
    scope: ['admin']
  },
  handler: function(request, reply) {
    let id = request.params.user_id;

    this.core.user.remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));

  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {
    let id = request.params.user_id;

    this.core.user.findById(id)
      .then((user) => reply(this.core.user.sanitize(user)))
      .catch((err) => reply(err));
  }
};

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {

    this.core.user.getAll()
      .then((users) => reply(users.map((user) => this.core.user.sanitize(user))))
      .catch((err) => reply(err));
  }
};