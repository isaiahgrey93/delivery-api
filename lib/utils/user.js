'use strict';

const JWT = require('jsonwebtoken');
const uuid = require('uuid');

module.exports = {
  sanitize: (data) => {
    if (data instanceof Array) {
      return data.map((user) => {
        delete user['password'];
        return user;
      })
    } else {
      delete data['password'];
      return data;
    };
  },
  hasAccount: (user) => {
    if (!user.connect_id) throw new Error(`No connect account found for user with id: <${user.id}>`);
    else return user;
  },
  grantJSONWebToken: (user) => {
    return JWT.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })
  },
  generatePasswordResetToken: () => {
    return {
      token: uuid.v4(),
      expiry: xHoursFromNow(48)
    }
  }
}

const xHoursFromNow = (hours) => {
  let now = new Date().getTime();
  let expiresInMilliseconds = hours * 60 * 60 * 1000;

  return new Date(now + expiresInMilliseconds).toISOString();
}