'use strict';

const Joi = require('joi');

module.exports.create = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required().description('User Email'),
      password: Joi.string().length(6).required().description('User Password'),
      scope: Joi.string().valid(['driver', 'requester', 'admin']).required().description('User Role')
    }
  },
  handler: function(request, reply) {
    let user = new this.db.models.User(request.payload);

    this.utils.model.validate(user);

    this.core.model('User').create(user)
      .then((user) => {
        let account = this.utils.user.sanitize(user)
        reply(account)
          .header('Authorization', this.core.user.grantToken(account))
      })
      .catch((err) => reply(err));
  }
};

module.exports.login = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required().description('User Email'),
      password: Joi.string().length(6).required().description('User Password')
    }
  },
  handler: function(request, reply) {
    let credentials = request.payload;

    this.core.user.findByEmail(credentials.email)
      .then((user) => user.comparePassword(credentials.password))
      .then((res) => {
        if (res.isBoom) return reply(res);
        else {
          let account = this.utils.user.sanitize(res);
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
  validate: {
    payload: {
      email: Joi.string().email().optional().description('User Email'),
      password: Joi.string().length(6).optional().description('User Password'),
      scope: Joi.string().valid(['driver', 'requester', 'admin']).optional().description('User Role')
    },
    params: {
      user_id: Joi.string().required().description('User Id')
    }
  },
  handler: function(request, reply) {
    let user = request.payload;
    user.id = request.params.user_id;

    this.core.model('User').update(user)
      .then((user) => reply(this.utils.user.sanitize(user)))
      .catch((err) => reply(err));

  }
};

module.exports.remove = {
  auth: {
    scope: ['admin']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.user_id;

    this.core.model('User').remove(id)
      .then((res) => reply(res))
      .catch((err) => reply(err));

  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User Id')
    }
  },
  handler: function(request, reply) {
    let id = request.params.user_id;

    this.core.model('User').findById(id)
      .then((user) => reply(this.utils.user.sanitize(user)))
      .catch((err) => reply(err));
  }
};

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  handler: function(request, reply) {

    this.core.model('User').getAll()
      .then((users) => reply(this.utils.user.sanitize(users)))
      .catch((err) => reply(err));
  }
};