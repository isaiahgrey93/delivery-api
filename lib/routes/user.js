'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports.create = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required().description('User email address.'),
      password: Joi.string().length(6).required().description('User password.'),
      scope: Joi.array().required().items(
        Joi.string().valid(['driver', 'requester', 'admin']).required()
      ).description('User given role(s).')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let user = new this.db.models.User(request.payload);

    this.utils.model.validate(user);

    this.core.model('User').create(user)
      .then((user) => {
        reply(user)
          .header('Authorization', this.core.user.grantToken(user))
      })
      .catch((err) => reply(err));
  }
};

module.exports.login = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required().description('User email address.'),
      password: Joi.string().length(6).required().description('User password.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let credentials = request.payload;

    this.core.user.findByEmail(credentials.email)
      .then((user) => !user ? Boom.badRequest(`Email <${credentials.email}> and password combination is incorrect.`) : user.comparePassword(credentials.password))
      .then((res) => {
        if (res.isBoom) return reply(res);
        else {
          reply(res)
            .header('Authorization', this.core.user.grantToken(res));
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
      email: Joi.string().email().optional().description('User email address.')
    },
    params: {
      user_id: Joi.string().required().description('User\'s unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let user = request.payload;
    user.id = request.params.user_id;

    this.core.model('User').update(user)
      .then((user) => this.utils.user.sanitize(user))
      .then((user) => reply(user))
      .catch((err) => reply(err));

  }
};

module.exports.remove = {
  auth: {
    scope: ['admin']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User\'s unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let id = request.params.user_id;

    this.core.model('User').remove(id)
      .then((user) => this.utils.user.sanitize(user))
      .then((user) => reply(user))
      .catch((err) => reply(err));

  }
}

module.exports.getById = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    params: {
      user_id: Joi.string().required().description('User\'s unique id.')
    },
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.').example('?populate=requester,driver')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let id = request.params.user_id;
    let relations = request.query.populate;

    this.core.model('User').findById(id, {
      populate: this.utils.model.populate(relations),
      without: {
        password: true
      }
    })
    .then((user) => reply(user))
    .catch((err) => reply(err));
  }
};

module.exports.getAll = {
  plugins: {
    policies: ['isAdminOrOwner']
  },
  validate: {
    query: {
      populate: Joi.string().description('Comma delimited list of field relations to populate.').example('?populate=requester,driver')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let relations = request.query.populate;

    this.core.model('User').getAll({
      populate: this.utils.model.populate(relations),
      without: {
        password: true
      }
    })
    .then((users) => reply(this.utils.user.sanitize(users)))
    .catch((err) => reply(err));
  }
};