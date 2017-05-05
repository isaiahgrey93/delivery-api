const { Drive } = require("../../common-entities");

class RethinkDbDriveStoreAdapter {
    constructor(thinky) {
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Drive;
        this._Model = thinky.createModel(
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
                driveType: type.string().enum(["consumer", "commercial"]),
                driveProgressConfirmation: type.object().schema({
                    pickupArrival: type.string(),
                    pickupLoaded: type.string(),
                    dropoff: type.string()
                }),
                consumerCargo: {
                    value: type.number(),
                    weight: type.number(),
                    description: type.number()
                },
                commercialCargoItems: [
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

        this._Model.define("toJSON", function() {
            return omit(this, []);
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let drive = new this._Entity(data);
        try {
            drive = await drive.save();
            drive = drive.toJSON();

            return this._modelToEntity(drive);
        } catch (e) {
            return e;
        }
    }

    async update() {
        let drive = new this._Model(data);

        try {
            drive = await this._Model.get(data.id);
            drive = await drive.merge(data);
            drive = await this._Model.save(drive, { conflict: "update" });
            drive = drive.toJSON();

            return this._modelToEntity(drive);
        } catch (e) {
            return e;
        }
    }

    async delete() {
        try {
            let drive = await this._Model.get(id);
            drive = drive.delete();
            drive = drive.toJSON();

            return this._modelToEntity(drive);
        } catch (e) {
            return new Error("No drive with id.");
        }
    }

    async getById() {
        try {
            let drive = await this._Model.get(id);
            drive = drive.toJSON();

            return this._modelToEntity(drive);
        } catch (e) {
            return new Error("No drive with id.");
        }
    }

    async getAll() {
        try {
            let drives = await new this._Query(this._Model).run();
            drives = drives.map(d => d.toJSON());

            return drives.map(d => this._modelToEntity(d));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbDriveStoreAdapter;
