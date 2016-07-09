'use strict';

const Models = require('thinky-loader').models;

module.exports = {
  create: (preset) => {
    return preset.save(preset)
  },
  update: (preset) => {
    return Models.Preset.get(preset.id)
      .update(preset)
      .run()
      .then((preset) => preset)
      .catch((err) => err);
  }
}