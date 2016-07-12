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
    tableName: "User",
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      email: Type.string().email(),
      password: Type.string().min(6),
      stripe_id: Type.string(),
      scope: Type.string().enum(['driver', 'requester', 'admin']),
      created_at: Type.date().default(() => ReQL.now()),
      updated_at: Type.date().default(() => ReQL.now())
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
          .then((authed) => authed ? this : false)
          .catch(Bcrypt.MISMATCH_ERROR, () => Boom.badRequest(`Email <${this.email}> and password combination is incorrect.`))
          .catch((err) => err);
      });
      
      model.pre('save', function (next) {

        return Core.user.findByEmail(this.email)
          .then((emailinUse) => {
            if(emailinUse) throw Boom.unauthorized(`Email address: <${this.email}> is already in use.`);
            else return this.generatePassword()
          })
          .then((user) => Core.stripe.createCustomer(user))
          .then((customer) => {
            Object.assign(this, {
              stripe_id: customer.id
            });
            next();
          })
          .catch((err) => next(err));
      });
    }
  };
};
