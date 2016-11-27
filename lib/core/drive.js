'use strict';

const googleMaps = require('@google/maps');

const clientGeocoder = googleMaps.createClient({
    key: 'AIzaSyCw9dMNxCnU5t7C_Rn6JNCHGgoZF1zU59I',
    Promise,
});
const clientDistanceMatrix = googleMaps.createClient({
    key: 'AIzaSyBUZAS_IZBVNBRoY7fhC2anqus0w-iXx9s',
    Promise,
});

const cost_per_pound = 0.50;
const cost_per_cubic_foot = 0.50;
const cost_per_mile = 1.00;

module.exports = {
    getEstimate: ({ items, distance }) => {
        let estimate = {};

        estimate.items = items.map(({ height, width, length, weight }) => {
            let volumeCost = calcVolumeCost(
                inchesToFeet(height) * inchesToFeet(width) * inchesToFeet(length)
            );
            let weightCost = calcWeightCost(weight);

            return (volumeCost + weightCost).toFixed(2) / 1;
        })

        estimate.distance = calcDistanceCost(distance);

        return estimate;
    },
    getGeoPoints: (drive) => {
        let addresses = [
            { address: formatAddress(drive.route.origin) },
            { address: formatAddress(drive.route.destination) }
        ];

        addresses = addresses.map((address) => clientGeocoder.geocode(address).asPromise());

        return Promise.all(addresses)
        .then((points) => {
            let origin = points[0].json.results[0].geometry.location;
            let destination = points[1].json.results[0].geometry.location;

            drive.route.origin.geo = setGeoPoint(origin);
            drive.route.destination.geo = setGeoPoint(destination);

            return drive;
        })
    },
    getTripDistance: ({ route, items }) => {
        let drive = {
            origins: [route.origin.geo.coordinates.reverse()],
            destinations: [route.destination.geo.coordinates.reverse()],
            units: 'imperial'
        }

        return clientDistanceMatrix.distanceMatrix(drive).asPromise()
        .then((res) => {
            return {
                items,
                distance: Number(res.json.rows[0].elements[0].distance.text.split(' ')[0]),
            }
        })

    }
}

const calcWeightCost = (weight) => {
    return weight * cost_per_pound;
}

const calcVolumeCost = (volume) => {
    return volume * cost_per_cubic_foot;
}

const calcDistanceCost = (distance) => {
    return distance * cost_per_mile;
}

const inchesToFeet = (inches) => {
    return inches / 12;
}

const formatAddress = ({ street, city, state, zip }) => {
    return `${street} ${city} ${state} ${zip}`
}

const setGeoPoint = ({ lng, lat }) => {
    return {
        type: "Point",
        coordinates: [lng, lat]
    }
}
