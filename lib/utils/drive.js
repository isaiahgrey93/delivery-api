'use strict';

const ORM = require('thinky-loader');
const Model = require('../core/model')

module.exports = {
    getGeometry: (coordinates = false, distance = 50, user = false) => {
        if (coordinates.length !== 2) return false;

        if (user) {
        	Model('User').update({ id: user.id, geo: ORM.thinky.r.point(coordinates[0], coordinates[1]) })
        }

        return ORM.thinky.r.circle(coordinates, distance, { unit: 'mi' })
    }
}
