const { Drive } = require("../../common-entities");
const DriveStorePort = require("./store-port");

class RethinkDbDriveStoreAdapter extends DriveStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._ReQL = r;
        this._Query = Query;
        this._Entity = Drive;
        this._Model = thinky.createModel(
            "Drive",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                requesterId: type.string(),
                driverId: type.any(),
                truckId: type.string(),
                helpers: type.number(),
                customer: type.object().schema({
                    phone: type.string(),
                    email: type.string(),
                    name: type.string()
                }),
                payment: type.object().schema({
                    chargeId: type.string(),
                    driverPayout: type.number(),
                    joeyPayout: type.number(),
                    transferIds: type.array().schema(type.string())
                }),
                price: type.number().min(0),
                status: type
                    .string()
                    .enum([
                        "unpaid",
                        "available",
                        "accepted",
                        "started",
                        "loading",
                        "driving",
                        "delivered",
                        "refunded"
                    ])
                    .default(() => "unpaid"),
                startTime: type.date(),
                endTime: type.date(),
                driveType: type.string().enum(["consumer", "business"]),
                driveProgressConfirmation: type.object().schema({
                    pickupArrival: type.string(),
                    pickupLoaded: type.string(),
                    dropoff: type.string()
                }),
                consumerCargo: {
                    value: type.number(),
                    weight: type.number(),
                    description: type.string(),
                    images: type.array(type.string())
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

        this._Model.ensureIndex("driverId");
        this._Model.ensureIndex("requesterId");

        this._Model.ensureIndex(
            "origin",
            this._ReQL.row("route")("origin")("geo"),
            {
                geo: true
            }
        );

        this._Model.ensureIndex(
            "destination",
            this._ReQL.row("route")("destination")("geo"),
            {
                geo: true
            }
        );
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let drive = new this._Model(data);

        drive = await resolve(drive.save());

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: this._modelToEntity(drive)
        };
    }

    async update(data) {
        let drive = new this._Model(data);

        drive = await resolve(this._Model.get(data.id));

        if (drive.error) {
            return {
                error: new Error("No drive with id.")
            };
        }

        drive = drive.result;

        drive = await resolve(drive.merge(data));

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        drive = await resolve(this._Model.save(drive, { conflict: "update" }));

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: this._modelToEntity(drive)
        };
    }

    async delete() {
        let drive = await resolve(this._Model.get(id));

        if (drive.error) {
            return {
                error: new Error("No drive with id.")
            };
        }

        drive = drive.result;

        drive = await resolve(drive.delete());

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: this._modelToEntity(drive)
        };
    }

    async getById(id) {
        let drive = await resolve(this._Model.get(id));

        if (drive.error) {
            return {
                error: new Error("No drive with id.")
            };
        }

        drive = drive.result;

        return {
            result: this._modelToEntity(drive)
        };
    }

    async getAll() {
        let drives = await resolve(new this._Query(this._Model).run());

        if (drives.error) {
            return {
                error: drives.error
            };
        }

        drives = drives.result;

        return {
            result: drives.map(d => this._modelToEntity(d))
        };
    }

    async filterBy(query, geometry, dates) {
        let _Query = new this._Query(this._Model);
        _Query = this._inRadius(_Query, geometry);
        _Query = this._inDateRange(_Query, dates);

        let drives = await resolve(_Query.filter(query));

        if (drives.error) {
            return {
                error: drives.error
            };
        }

        drives = drives.result;

        return {
            result: drives.map(d => this._modelToEntity(d))
        };
    }

    _inRadius(query, geometry = {}) {
        let { coordinates, distance } = geometry;

        if (!distance || !coordinates) return query;

        let radius = this._ReQL.circle(coordinates, distance, {
            unit: "mi"
        });

        return query.getIntersecting(radius, { index: "origin" });
    }

    _inDateRange(query, dates = {}) {
        let { start, end, index } = dates;

        if (!start || !end) return query;
        if (!index) index = "startTime";

        end = new Date(end);
        start = new Date(start);

        let range = this._ReQL
            .row(index)
            .during(
                this._ReQL.time(
                    start.getFullYear(),
                    start.getMonth() + 1,
                    start.getDate(),
                    "Z"
                ),
                this._ReQL.time(
                    end.getFullYear(),
                    end.getMonth() + 1,
                    end.getDate(),
                    "Z"
                ),
                {
                    leftBound: "open",
                    rightBound: "open"
                }
            );

        return query.filter(range);
    }
}

module.exports = RethinkDbDriveStoreAdapter;
