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
        try {
            vehicle = await vehicle.save();

            return this._modelToEntity(vehicle);
        } catch (e) {
            return e;
        }
    }

    async update(data) {
        let vehicle = new this._Model(data);

        try {
            vehicle = await this._Model.get(data.id);
            vehicle = await vehicle.merge(data);
            vehicle = await this._Model.save(vehicle, { conflict: "update" });

            return this._modelToEntity(vehicle);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let vehicle = await this._Model.get(id);
            vehicle = vehicle.delete();

            return this._modelToEntity(vehicle);
        } catch (e) {
            return new Error("No vehicle with id.");
        }
    }

    async getById(id) {
        try {
            let vehicle = await this._Model.get(id);

            return this._modelToEntity(vehicle);
        } catch (e) {
            return new Error("No vehicle with id.");
        }
    }

    async getAll() {
        try {
            let vehicles = await new this._Query(this._Model).run();

            return vehicles.map(v => this._modelToEntity(v));
        } catch (e) {
            return e;
        }
    }

    async filterBy(query) {
        try {
            let vehicles = await new this._Query(this._Model).filter(query);

            return vehicles.map(v => this._modelToEntity(v));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbVehicleStoreAdapter;
