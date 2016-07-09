'use strict';

const Models = require('thinky-loader').models;

module.exports = {
  findById: (id) => {
    return Models.Preset.get(id)
      .getJoin()
      .run()
      .then((user) => user || false)
      .catch((err) => err);
  },
  update: (preset) => {
    return Models.Preset.get(preset.id)
      .update(preset)
      .run()
      .then((preset) => preset)
      .catch((err) => err);
  }
}