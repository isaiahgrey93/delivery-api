const { Drive } = require("../../common-entities");

class RethinkDbDriveStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
            "Drive",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                requesterId: type.string(),
                driverId: type.string(),
                customer: type.object().schema({
                    phone: type.string(),
                    email: type.string()
                }),
                payment: type.object().schema({
                    chargeId: type.string(),
                    transferIds: type.array().schema(type.string())
                }),
                price: type.number().min(0),
                status: type
                    .string()
                    .enum([
                        "unpaid",
                        "available",
                        "accepted",
                        "loading",
                        "driving",
                        "delivered",
                        "refunded"
                    ])
                    .default(() => "unpaid"),
                startTime: type.date(),
                endTime: type.date(),
                driveProgressConfirmation: type.object().schema({
                    pickupArrival: type.string(),
                    pickupLoaded: type.string(),
                    dropoff: type.string()
                }),
                commercialCargo: {
                    value: type.number(),
                    weight: type.number(),
                    description: type.number()
                },
                consumerCargoItems: [
                    type.object().schema({
                        name: type.string(),
                        quantity: type.number(),
                        height: type.number(),
                        width: type.number(),
                        length: type.number(),
                        weight: type.number(),
                        value: type.number(),
                        notes: type.string().optional(),
                        images: type.array().schema(type.string())
                    })
                ],
                route: type.object().schema({
                    distance: type.number(),
                    origin: type.object().schema({
                        name: type.string(),
                        street: type.string(),
                        city: type.string(),
                        state: type.string(),
                        zip: type.string(),
                        geo: type.object()
                    }),
                    destination: type.object().schema({
                        name: type.string(),
                        street: type.string(),
                        city: type.string(),
                        state: type.string(),
                        zip: type.string(),
                        geo: type.object()
                    })
                }),
                support: type
                    .object()
                    .schema({
                        driverExt: type.string(),
                        requesterExt: type.string(),
                        customerExt: type.string()
                    })
                    .default({})
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Entity = Drive;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbDriveStoreAdapter;
