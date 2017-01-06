'use strict';

const ORM = require('thinky-loader');
const Boom = require('boom');

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

const getDate = (ts) => {
    let dt = new Date(ts);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

const getRangeDate = (dt) => {
    return ORM.thinky.r.time(
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate(),
        'Z'
    )
}

const getGeoQuery = (query, geometry) => {
    if (!geometry) return query;
    
    return query.getIntersecting(geometry, { index: 'origin' })
}

module.exports = {
    query: (query, options) => {
        if (!options) options = {};
        if (!query) query = {};


        return getGeoQuery(ORM.models.Drive, options.geometry)
            .filter(query, {})
            .getJoin(options.populate)
    },
    getUserDriveStats: (user, start, end) => {
        return ORM.models.Drive
            .filter(
                ORM.thinky.r
                    .row('status').eq('delivered')
                    .and(
                        ORM.thinky.r.row('start_time')
                            .during(
                                getRangeDate(getDate(start - 86400000)),
                                getRangeDate(getDate(end + 86400000)),
                                {
                                    leftBound: 'open',
                                    rightBound: 'open'
                                }
                            )
                    )
                    .and(ORM.thinky.r.row('requester_id').eq(user).or(ORM.thinky.r.row('driver_id').eq(user)))
            )
            .then((drives) => {
                return drives
                    .map(({ price, start_time, end_time }) => {
                        return {
                            price,
                            duration: new Date(end_time).getTime() - new Date(start_time).getTime(),
                        }
                    }).reduce((a, b, idx, arr) => {
                        return {
                            price: a.price + b.price,
                            duration: a.duration + b.duration,
                            trips: arr.length,
                        }    
                    }, {
                        price: 0,
                        duration: 0,
                        trips: 0,
                    })
            })
    },
    getEstimate: ({ items, distance }) => {
        let estimate = {};

        estimate.items = items.map(({ height, width, length, weight, quantity }) => {
            let volumeCost = calcVolumeCost(
                inchesToFeet(height) * inchesToFeet(width) * inchesToFeet(length)
            );
            let weightCost = calcWeightCost(weight);

            return ((volumeCost + weightCost).toFixed(2) / 1) * quantity;
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

             let data = {
                origins: [[origin.lat, origin.lng]],
                destinations: [[destination.lat, destination.lng]],
                units: 'imperial'
            }

            return clientDistanceMatrix.distanceMatrix(data).asPromise()
            .then((res) => {
                drive.route.distance = Number(res.json.rows[0].elements[0].distance.text.split(' ')[0])
                return drive
            })
        })
        .catch((err) => err)
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

    },
    getByUser: (user, options) => {
        if (!options) options = {};
        return ORM.models.Drive
            .filter(
                ORM.thinky.r.row('requester_id').eq(user)
                    .or(
                        ORM.thinky.r.row('driver_id').eq(user)
                    )
            )
            .getJoin(options.populate)
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

const setGeoPoint = ({ lng, lat }) => ORM.thinky.r.point(lng, lat);
