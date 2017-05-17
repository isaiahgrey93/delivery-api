const VehicleStorePort = require("./store-port");
const { Vehicle } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbVehicleStoreAdapter extends VehicleStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Vehicle;
        this._Model = thinky.createModel(
            "Vehicle",
            {
                id: type.string().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                userId: type.string(),
                make: type.string(),
                model: type.string(),
                year: type.string(),
                licensePlate: type.object().schema({
                    number: type.string(),
                    state: type.string()
                }),
                insurance: type.string(),
                registration: type.string(),
                images: [type.string()]
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Model.ensureIndex("userId");
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let vehicle = new this._Model(data);

        vehicle = await resolve(vehicle.save());

        if (vehicle.error) {
            return {
                error: vehicle.error
            };
        }

        vehicle = vehicle.result;

        return {
            result: this._modelToEntity(vehicle)
        };
    }

    async update(data) {
        let vehicle = new this._Model(data);

        try {
            vehicle = await resolve(this._Model.get(data.id));

            if (vehicle.error) {
                return {
                    error: new Error("No vehicle with id.")
                };
            }

            vehicle = vehicle.result;

            vehicle = await resolve(vehicle.merge(data));

            if (vehicle.error) {
                return {
                    error: vehicle.error
                };
            }

            vehicle = vehicle.result;

            vehicle = await resolve(
                this._Model.save(vehicle, { conflict: "update" })
            );

            if (vehicle.error) {
                return {
                    error: vehicle.error
                };
            }

            vehicle = vehicle.result;

            return {
                result: this._modelToEntity(vehicle)
            };
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        let vehicle = await resolve(this._Model.get(id));

        if (vehicle.error) {
            return {
                error: new Error("No vehicle with id.")
            };
        }

        vehicle = vehicle.result;

        vehicle = await resolve(vehicle.delete());

        if (vehicle.error) {
            return {
                error: vehicle.error
            };
        }

        vehicle = vehicle.result;

        return {
            result: this._modelToEntity(vehicle)
        };
    }

    async getById(id) {
        let vehicle = await resolve(this._Model.get(id));

        if (vehicle.error) {
            return {
                error: new Error("No vehicle with id.")
            };
        }

        vehicle = vehicle.result;

        return {
            result: this._modelToEntity(vehicle)
        };
    }

    async getAll() {
        let vehicles = await resolve(new this._Query(this._Model).run());

        if (vehicles.error) {
            return {
                error: vehicles.error
            };
        }

        vehicles = vehicles.result;

        return {
            result: vehicles.map(v => this._modelToEntity(v))
        };
    }

    async filterBy(query) {
        let vehicles = await resolve(
            new this._Query(this._Model).filter(query)
        );

        if (vehicles.error) {
            return {
                error: vehicles.error
            };
        }

        vehicles = vehicles.result;

        return {
            result: vehicles.map(v => this._modelToEntity(v))
        };
    }
}

module.exports = RethinkDbVehicleStoreAdapter;
