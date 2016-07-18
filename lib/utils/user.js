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
  },
  hasAccount: (user) => {
    if (!user.connect_id) throw new Error(`No connect account found for user with id: <${user.id}>`);
    else return user;
  }
}