'use strict';

const ORM = require('thinky-loader');

module.exports = {
    getGeometry: (coordinates = false, distance = 50) => {
        if (coordinates.length !== 2) return false;

        return ORM.thinky.r.circle(coordinates, distance, { unit: 'mi' })
    }
}
