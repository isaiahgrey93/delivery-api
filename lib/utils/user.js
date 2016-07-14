'use strict';

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
  }
}