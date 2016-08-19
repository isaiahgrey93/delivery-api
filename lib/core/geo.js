'use strict';

const NodeGeocoder = require('node-geocoder');
const config = {
    provider: 'google',
    apiKey: 'AIzaSyBS2ADCxIbSmWIXIWIGlKW_fOj8PPISIf8',
}

var geocoder = NodeGeocoder(config);

module.exports = {
    getAddress: () => {

    },
    getCoordinates: (drive) => {
        let addresses = [formatAddress(drive.route.origin), formatAddress(drive.route.destination)];

        return geocoder.batchGeocode(addresses)
            .then((res) => {
                let coordinates = res.map(({ value }) => {
                    return {
                        'type': 'Point',
                        'coordinates': [value[0].longitude, value[0].latitude]
                    }
                });

                drive.route.origin.geo = coordinates[0];
                drive.route.destination.geo = coordinates[1];

                return drive;
            })
            .catch((err) => err);
    }
}

const formatAddress = ({ street, city, state, country, postal_code }) => {
    return `${street} ${city} ${state} ${country} ${postal_code}`
}