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
      scope: Type.string().enum(['driver', 'requester', 'admin']).required(),
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
          .then((authenticated) => authenticated ? this : false)
          .catch(Bcrypt.MISMATCH_ERROR, () => false)
          .catch((err) => err);
      });
      
      model.pre('save', function (next) {
        let query = new Thinky.Query(Models.User)

        query.filter({ email: this.email })
          .limit(1)
          .run()
          .then((users) => {
            if (users.length > 0) next(Boom.unauthorized("Value for [email] is already in use."));
            else return this.generatePassword();
          })
          .then((user) => next())
          .catch((err) => next(err));
      });
    }
  };
};
