'use strict';

const Models = require('thinky-loader').models;

module.exports = {
  create: (vehicle) => {
    return vehicle.save();
  },
  update: (vehicle) => {
    return Models.Vehicle.get(vehicle.id)
      .update(vehicle)
      .run()
  }
}