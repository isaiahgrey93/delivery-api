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
  },
  remove: (id) => {
    return Models.Preset.get(id)
      .delete()
      .execute()
  }
}