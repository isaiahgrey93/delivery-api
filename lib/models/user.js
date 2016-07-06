'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const ReQL = Thinky.r;
  const Query = Thinky.Query;
  const Type   = Thinky.type;
  const Models = this.models;
  const Bcrypt = require('bcrypt-as-promised');

  return {
    tableName: "User",
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      email: Type.string().required().email(),
      password: Type.string().required().min(6),
      created_at: Type.date().required().default(() => ReQL.now()),
      updated_at: Type.date().required().default(() => ReQL.now())
    },
    init: (model) => {

      // hash & salt password to store
      model.define('generatePassword', function () {
        return Bcrypt.genSalt(10)
          .then((salt) => Bcrypt.hash(this.password, salt))
          .then((hash) => Object.assign(this, { password: hash } ))
          .catch((err) => err);
      });
      
      // pre save hook
      model.pre('save', function (next) {
        let userQuery = new Query(Models.User)

        // check if email is in use before saving
        userQuery.filter({ email: this.email })
          .run()
          .then((users) => {
            if (users.length > 0) {
              next({
                "name": "ValidationError",
                "message": "Value for [email] is already in use."
              });
            } else {
              next();
            }
          });
      });
    }
  };
};
