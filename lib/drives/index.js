const { keyBy } = require("lodash");

class Drive {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
        this.geo = args.geo;

        this._pricePerPound = 0.35;
        this._pricePerCubicFoot = 0.35;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(drive) {
        let newDrive = new this.Entity(drive);

        newDrive = await resolve(this.store.create(newDrive));

        if (newDrive.error) {
            return {
                error: newDrive.error
            };
        }

        newDrive = newDrive.result;

        return {
            result: newDrive
        };
    }

    async update(drive, options = {}) {
        let updatedDrive = new this.Entity(drive);

        updatedDrive = await resolve(this.store.update(updatedDrive));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        updatedDrive = resolve(this.populate(updatedDrive, options.populate));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        return {
            result: updatedDrive
        };
    }

    async delete(id) {
        let fetchedDrive = await resolve(this.store.delete(id));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        return {
            result: fetchedDrive
        };
    }

    async getById(id, options = {}) {
        let fetchedDrive = await resolve(this.store.getById(id));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        fetchedDrive = resolve(this.populate(fetchedDrive, options.populate));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        return {
            result: fetchedDrive
        };
    }

    async getAll(options = {}) {
        let fetchedDrives = await resolve(this.store.getAll());

        if (fetchedDrives.error) {
            return {
                error: fetchedDrives.error
            };
        }

        fetchedDrives = fetchedDrives.result;

        fetchedDrives = await Promise.all(
            fetchedDrives.map(async d => {
                d = await resolve(
                    this.libs.drives.populate(d, options.populate)
                );

                if (d.error) {
                    return u.error;
                }

                return d.result;
            })
        );

        return {
            result: fetchedDrives
        };
    }

    async filterBy(query, options = {}) {
        let fetchedDrives = await resolve(this.store.filterBy(query));

        if (fetchedDrives.error) {
            return {
                error: fetchedDrives.error
            };
        }

        fetchedDrives = fetchedDrives.result;

        fetchedDrives = await Promise.all(
            fetchedDrives.map(async c => {
                d = await resolve(
                    this.libs.drives.populate(d, options.populate)
                );

                if (d.error) {
                    return d.error;
                }

                return d.result;
            })
        );

        return {
            result: fetchedDrives
        };
    }

    async populate(drive, relations) {
        let { driver, requester, truck } = keyBy(relations);
        let { driverId, requesterId, truckId } = drive;

        if (driver && driverId) {
            let driveDriver = await this.libs.users.getById(driverId);

            drive.driver = driveDriver;
        }

        if (requester && requesterId) {
            let driveRequester = await this.libs.users.getById(requesterId);

            drive.requester = driveRequester;
        }

        if (truck && truckId) {
            let driveRequester = await this.libs.trucks.getById(truckId);

            drive.truck = driveTruck;
        }

        return drive;
    }

    async accept(driveId, driverId, options = {}) {
        let drive = await resolve(this.libs.drives.getById(driveId));

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        if (drive.driverId) {
            return {
                error: new Error("Drive with id is not available.")
            };
        }

        let chargeId = drive.payment.chargeId;

        let charge = await resolve(this.libs.payments.captureCharge(chargeId));

        if (charge.error) {
            return {
                error: charge.error
            };
        }

        charge = charge.result;

        // TODO(isaiah) send sms message to customer
        // "Your delivery has been accepted by a JOEY driver. The driver will be calling you soon to coordinate your delivery."

        drive = Object.assign({}, drive, {
            status: "accepted",
            driverId: driverId
        });

        drive = await resolve(this.libs.drives.update(drive, {}, options));

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: drive
        };
    }

    async complete(driveId) {
        let drive = await resolve(
            this.libs.drives.getById(driveId, {
                populate: ["driver", "requester", "truck"]
            })
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        if (drive.status === "delivered") {
            return {
                error: new Error("Drive with id has already been processed.")
            };
        }

        drive = drive.result;

        let transfer = await resolve(
            this.libs.payment.createTransfer(
                price,
                drive.payment.chargeId,
                drive.driver.paymentAccountId,
                {
                    drive: drive.id,
                    type: drive.driveType,
                    origin: drive.route.origin,
                    destination: drive.route.destination
                }
            )
        );

        if (transfer.error) {
            return {
                error: transfer.error
            };
        }

        transfer = transfer.result;

        let { payment = {} } = drive;

        payment = Object.assign({}, { transfers: [] }, payment);

        payment.transfers.push(transfer);

        drive = await resolve(
            this.libs.drives.update(
                {
                    payment,
                    id: drive.id,
                    status: "delivered"
                },
                {
                    populate: ["driver", "requester", "truck"]
                }
            )
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: drive
        };
    }

    async charge(driveId, paymentSource, options = {}) {
        let drive = await resolve(
            this.libs.drives.getById(driveId, {
                populate: ["driver", "requester", "truck"]
            })
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        let charge = await resolve(
            this.libs.payments.authorizeCharge(paymentSource, drive.price, {
                drive: drive.id,
                type: drive.driveType,
                origin: drive.route.origin,
                destination: drive.route.destination
            })
        );

        if (charge.error) {
            return {
                error: charge.error
            };
        }

        charge = charge.result;

        let { payment = {} } = drive;

        payment = Object.assign(payment, {
            chargeId: charge.id,
            driverPayout: this.utils.stripe.getPayout("driver", drive.price),
            joeyPayout: this.utils.stripe.getPayout("joey", drive.price)
        });

        drive = await resolve(
            this.libs.drives.update(
                driveId,
                Object.assign(
                    { id: driveId },
                    { payment: payment, status: "available" }
                ),
                options
            )
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: drive
        };
    }

    async estimate(driveId) {
        let drive = await resolve(
            this.libs.drives.getById(driveId, {
                populate: ["requester", "driver", "truck"]
            })
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        let { type, route, truck, helpers } = drive;

        let { origin = {}, destination = {} } = route;

        let { base: pricePerHour, mile: pricePerMile } = truck;

        let {
            street: origStreet = "",
            state: origState = "",
            city: origCity = "",
            zip: origZip = ""
        } = origin;

        let {
            street: destStreet = "",
            state: destState = "",
            city: destCity = "",
            zip: destZip = ""
        } = destination;

        let distance = await resolve(
            this.geo.getDistance(
                `${origStreet} ${origCity} ${origState} ${origZip}`,
                `${destStreet} ${destCity} ${destState} ${destZip}`
            )
        );

        if (distance.error) {
            return {
                error: distance.error
            };
        }

        distance = distance.result;

        let estimate = {
            cargo: 0,
            mileage: 0
        };

        if (type === "consumer") {
            estimate.cargo = pricePerHour;
        }

        if (type === "commerical") {
            let { commericalCargoItems = [] } = drive;

            estimate.cargo = commericalCargoItems
                .map(({ height, width, length, weight, quantity }) => {
                    let volume = height / 12 * (width / 12) * (length / 12);

                    let volumeCost = volume * this._pricePerCubicFoot;
                    let weightCost = weight * this._pricePerPound;

                    let cost = volumeCost + weightCost;

                    let total = cost * quantity;

                    return total.toFixed(2);
                })
                .reduce((a, b) => a + b);
        }

        estimate.mileage = distance * pricePerMile;

        return {
            result: estimate
        };
    }
}

module.exports = Drive;
