const { Vehicle } = require("../../common-entities");

class RethinkDbVehicleStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
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

        this._Entity = Vehicle;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbVehicleStoreAdapter;
