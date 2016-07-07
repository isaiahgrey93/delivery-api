const Models = require('thinky-loader').models;

module.exports = {
  getAll: () => {
    return Models.User
      .run()
      .then((users) => users || false)
      .catch((err) => err);
  },
  findById: (id) => {
    return Models.User.get(id)
      .run()
      .then((user) => user || false)
      .catch((err) => err);
  },
  findByEmail: (email) => {
    return Models.User.filter({ email: email })
      .run()
      .then((users) => users[0] || false)
      .catch((err) => err);
  }
}