'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports.create = {
  auth: {
    mode: 'optional'
  },
  plugins : {
    policies: ['restrictAdminCreation']
  },
  validate: {
    payload: {
      email: Joi.string().email().required().description('User email address.'),
      password: Joi.string().min(6).required().description('User password.'),
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
        let account = this.utils.user.sanitize(user);
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
    policies: ['isAdminOrOwner', 'restrictAdminFields']
  },
  validate: {
    payload: {
      name: Joi.string().description('User\'s name.'),
      email: Joi.string().email().description('User\'s email address.'),
      phone: Joi.string().description('User\'s phone number.'),
      dob: Joi.string().description('User\'s date of birth.'),
      drivers_license_number: Joi.string().description('User\'s drivers license number.'),
      drivers_license_expiry: Joi.string().description('User\'s drivers license expiration date.'),
      state: Joi.string().description('User\'s drivers license issue state.'),
      status: Joi.string().valid('unverified', 'verified', 'rejected').description('User\'s status.'),
      scope: Joi.array().items(Joi.string().valid('driver', 'requester', 'admin')).description('User roles')
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
      populate: Joi.string().description('Comma delimited list of field relations to populate.').example('?populate=vehicle,presets')
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
      populate: Joi.string().description('Comma delimited list of field relations to populate.').example('?populate=vehicle,presets')
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
    .then((users) => reply(users))
    .catch((err) => reply(err));
  }
};