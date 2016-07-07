'use strict'

const Bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');

module.exports = function () {
  const Thinky = this.thinky;
  const ReQL = Thinky.r;
  const Type = Thinky.type;
  const Models = this.models;

  return {
    tableName: "User",
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      email: Type.string().required().email(),
      password: Type.string().required().min(6),
      scope: [Type.string().enum(['user', 'requester', 'admin']).required()],
      created_at: Type.date().required().default(() => ReQL.now()),
      updated_at: Type.date().required().default(() => ReQL.now())
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
          .then((authenticated) => {
            if (!authenticated) return false;
            else return this;
          })
          .catch(Bcrypt.MISMATCH_ERROR, () => false)
          .catch((err) => err);
      });
      
      model.pre('save', function (next) {
        let userQuery = new Thinky.Query(Models.User)

        userQuery.filter({ email: this.email })
          .run()
          .then((users) => {
            if (users.length > 0) next(Boom.unauthorized("Value for [email] is already in use."));
            else next();
          })
          .catch((err) => next(err));
      });
    }
  };
};
