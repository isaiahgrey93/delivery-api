const GeoLibPort = require("./lib-port");

class GoogleMapsGeoAdapter extends GeoLibPort {
    constructor(googleMaps) {
        super();
        this._GoogleMaps = googleMaps;
    }

    async getGeoPoint(address) {
        let { street = "", city = "", state = "", zip = "" } = address;

        address = `${street} ${city} ${state} ${zip}`;

        let point = await resolve(
            this._GoogleMaps.geocode({ address }).asPromise()
        );

        if (point.error) {
            return {
                error: point.error
            };
        }

        if (point.result.json.results.length === 0) {
            return {
                error: new Error(`Invalid address entered. ${address}`)
            };
        }

        point = point.result.json.results[0].geometry.location;

        return {
            result: point
        };
    }

    async getDistance(origin, destination) {
        let route = {
            units: "imperial",
            origins: [origin],
            destinations: [destination]
        };

        let distances = await resolve(
            this._GoogleMaps.distanceMatrix(route).asPromise()
        );

        if (distances.error) {
            return {
                error: distances.error
            };
        }

        distances = distances.result;

        let distance = distances.json.rows[0].elements[0].distance;

        distance = distance.text.split(" ")[0].split(" ")[0];

        return {
            result: Number(distance)
        };
    }
}

module.exports = GoogleMapsGeoAdapter;
