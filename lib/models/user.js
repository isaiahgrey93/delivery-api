'use strict';

const Bcrypt = require('bcrypt-as-promised');
const Thinky = require('../utils/thinky');
const ReQL = Thinky.r;
const Type = Thinky.type;

const User = Thinky.createModel('User', {
  id: Type.string().default(() => ReQL.uuid()),
  email: Type.string().email(),
  password: Type.string(),
  created_at: {
    _type: Date,
    default: ReQL.now()
  },
  updated_at: {
    _type: Date,
    default: ReQL.now()
  }
})

User._methods.generatePassword = function() {
    var user = this;

    return Bcrypt.genSalt(10)
      .then((salt) => Bcrypt.hash(user.password, salt))
      .then((hash) => Object.assign(user, { password: hash } ))
      .catch((err) => err)
};

module.exports = User;