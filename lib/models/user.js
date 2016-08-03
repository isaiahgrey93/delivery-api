'use strict'

const Bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');
const Core = require('../core');

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'User',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      email: Type.string().email(),
      password: Type.string().min(6),
      name: Type.string(),
      phone: Type.string(),
      dob: Type.string(),
      drivers_license_expiry: Type.string(),
      drivers_license_number: Type.string(),
      state: Type.string(),
      connect_id: Type.any(),
      status: Type.string().enum('unverified', 'verified', 'rejected').default('unverified'),
      scope: [Type.string().enum(['driver', 'requester', 'admin']).required()],
      password_reset: {
        token: Type.string(),
        expiry: Type.string()
      },
      created_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {

      model.define('generatePassword', function () {
        return Bcrypt.genSalt(10)
          .then((salt) => Bcrypt.hash(this.password, salt))
          .then((hash) => Object.assign(this, { password: hash } ))
          .catch((err) => err);
      });

      model.define('comparePassword', function (password) {
        return Bcrypt.compare(password, this.password)
          .then((authed) => {
            if (authed) {
              delete this.password;
              return this;
            } else return false;
          })
          .catch(Bcrypt.MISMATCH_ERROR, () => Boom.badRequest(`Email <${this.email}> and password combination is incorrect.`))
          .catch((err) => err);
      });

      model.defineStatic('withoutFields', function(fields) {
        if (!fields) return this;
        else return this.without(fields);
      });
      
      model.pre('save', function (next) {
        Core.user.findByEmail(this.email)
          .then((emailinUse) => {
            if(emailinUse) throw Boom.unauthorized(`Email address: <${this.email}> is already in use.`);
            else return this.generatePassword()
          })
          .then(() => next())
          .catch((err) => next(err));
      });

    }
  };
};
