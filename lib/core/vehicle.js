'use strict';

const Models = require('thinky-loader').models;

module.exports = {
  update: (vehicle) => {
    return Models.Vehicle.get(vehicle.id)
      .update(vehicle)
      .run()
      .then((vehicle) => vehicle)
      .catch((err) => err);
  }
}