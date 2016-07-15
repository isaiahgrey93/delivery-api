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
  hasAccount: (user, account_type) => {
    if (!user[`${account_type}_id`]) throw new Error(`No <${account_type}> account found for user with id: <${user.id}>`);
    else return user;
  }
}