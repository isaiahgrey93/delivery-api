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
  toObject: (users) => {
    return users.reduce((prev, curr, idx, arr) => {
      prev[arr[idx].id] = arr[idx]
      return prev;
    }, {})
  },
  hasAccount: (user) => {
    if (!user.connect_id) throw new Error(`No connect account found for user with id: <${user.id}>`);
    else return user;
  }
}