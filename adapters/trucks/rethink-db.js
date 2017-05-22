const TruckStorePort = require("./store-port");
const { Truck } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbTruckStoreAdapter extends TruckStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Truck;
        this._Model = thinky.createModel(
            "Truck",
            {
                id: type.string().required().default(() => r.uuid()),
                type: type.string().enum(["open", "closed"]),
                price: type
                    .object()
                    .schema({
                        base: type.number().required(),
                        mile: type.number().required()
                    })
                    .required(),
                length: type.number().required(),
                width: type.number().required(),
                height: type.number().required(),
                name: type.string().required(),
                image: type.any().required()
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let truck = new this._Model(data);

        truck = await resolve(truck.save());

        if (truck.error) {
            return {
                error: truck.error
            };
        }

        truck = truck.result;

        return {
            result: this._modelToEntity(truck)
        };
    }

    async update(data) {
        let truck = new this._Model(data);

        truck = await resolve(this._Model.get(data.id));

        if (truck.error) {
            return {
                error: new Error("No truck with id.")
            };
        }

        truck = truck.result;

        truck = await resolve(truck.merge(data));

        if (truck.error) {
            return {
                error: truck.error
            };
        }

        truck = truck.result;

        truck = await resolve(this._Model.save(truck, { conflict: "update" }));

        if (truck.error) {
            return {
                error: truck.error
            };
        }

        truck = truck.result;

        return {
            result: this._modelToEntity(truck)
        };
    }

    async delete(id) {
        let truck = await resolve(this._Model.get(id));

        if (truck.error) {
            return {
                error: new Error("No truck with id.")
            };
        }

        truck = truck.result;

        truck = await resolve(truck.delete());

        if (truck.error) {
            return {
                error: truck.error
            };
        }

        truck = truck.result;

        return {
            result: this._modelToEntity(truck)
        };
    }

    async getById(id) {
        let truck = await resolve(this._Model.get(id));

        if (truck.error) {
            return {
                error: new Error("No truck with id.")
            };
        }

        truck = truck.result;

        return {
            result: this._modelToEntity(truck)
        };
    }

    async getAll() {
        let trucks = await resolve(new this._Query(this._Model).run());

        if (trucks.error) {
            return {
                error: trucks.error
            };
        }

        trucks = trucks.result;

        return {
            result: trucks.map(s => this._modelToEntity(s))
        };
    }

    async filterBy(query) {
        let trucks = await resolve(new this._Query(this._Model).filter(query));

        if (trucks.error) {
            return {
                error: trucks.error
            };
        }

        trucks = trucks.result;

        return {
            result: trucks.map(s => this._modelToEntity(s))
        };
    }
}

module.exports = RethinkDbTruckStoreAdapter;
