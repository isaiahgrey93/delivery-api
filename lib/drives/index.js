const { keyBy } = require("lodash");
const utils = require("../../utils");

class Drive {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
        this.geo = args.geo;

        this._pricePerMile = 0.35;
        this._pricePerPound = 0.35;
        this._pricePerCubicFoot = 0.35;
        this._pricePerHelper = 20.00;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(drive) {
        let newDrive = new this.Entity(drive);

        let originPoint = await resolve(
            this.geo.getGeoPoint(newDrive.route.origin)
        );

        if (originPoint.error) {
            return {
                error: originPoint.error
            };
        }

        originPoint = originPoint.result;

        newDrive.route.origin.geo = originPoint;

        let destinationPoint = await resolve(
            this.geo.getGeoPoint(newDrive.route.destination)
        );

        if (destinationPoint.error) {
            return {
                error: destinationPoint.error
            };
        }

        destinationPoint = destinationPoint.result;

        newDrive.route.destination.geo = destinationPoint;

        let extensions = await resolve(
            this.libs.supportExtensions.filterBy({ active: false }, {}, 3)
        );

        if (extensions.error) {
            return {
                error: extensions.error
            };
        }

        extensions = extensions.result;

        let [driver, requester, customer] = extensions;

        newDrive.support = {
            driverExt: driver,
            requesterExt: requester,
            customerExt: customer
        };

        let {
            street: origStreet = "",
            state: origState = "",
            city: origCity = "",
            zip: origZip = ""
        } = newDrive.route.origin;

        let {
            street: destStreet = "",
            state: destState = "",
            city: destCity = "",
            zip: destZip = ""
        } = newDrive.route.destination;

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

        newDrive.route.distance = Number(distance);

        newDrive = await resolve(this.store.create(newDrive));

        if (newDrive.error) {
            return {
                error: newDrive.error
            };
        }

        newDrive = newDrive.result;

        let price = await resolve(this.libs.drives.estimate(newDrive.id));

        if (price.error) {
            return {
                error: price.error
            };
        }

        price = price.result;

        newDrive.price = Number(price.base || 0) + Number(price.mileage || 0);

        newDrive = await resolve(this.libs.drives.update(newDrive));

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
        let fetchedDrive = await resolve(this.libs.drives.getById(drive.id));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        if (drive.route && drive.route.origin) {
            let originPoint = await resolve(
                this.geo.getGeoPoint(drive.route.origin)
            );

            if (originPoint.error) {
                return {
                    error: originPoint.error
                };
            }

            originPoint = originPoint.result;

            drive.route.origin.geo = originPoint;
        }

        if (drive.route && drive.route.destination) {
            let destinationPoint = await resolve(
                this.geo.getGeoPoint(drive.route.destination)
            );

            if (destinationPoint.error) {
                return {
                    error: destinationPoint.error
                };
            }

            destinationPoint = destinationPoint.result;

            drive.route.destination.geo = destinationPoint;
        }

        if (drive.route && drive.route.origin && drive.route.destination) {
            let {
                street: origStreet = "",
                state: origState = "",
                city: origCity = "",
                zip: origZip = ""
            } = drive.route.origin;

            let {
                street: destStreet = "",
                state: destState = "",
                city: destCity = "",
                zip: destZip = ""
            } = drive.route.destination;

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

            drive.route.distance = Number(distance);
        }

        let updatedDrive = new this.Entity(drive);

        updatedDrive = await resolve(this.store.update(updatedDrive));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        let price = await resolve(this.libs.drives.estimate(updatedDrive.id));

        if (price.error) {
            return {
                error: price.error
            };
        }

        price = price.result;

        updatedDrive.price =
            Number(price.base || 0) + Number(price.mileage || 0);

        updatedDrive = await resolve(this.store.update(updatedDrive));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        updatedDrive = await resolve(
            this.populate(updatedDrive, options.populate)
        );

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

        fetchedDrive = await resolve(
            this.populate(fetchedDrive, options.populate)
        );

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

    async filterBy(query, options = {}, geometry = {}, dates = {}) {
        let fetchedDrives = await resolve(
            this.store.filterBy(query, geometry, dates)
        );

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
            let driveDriver = await resolve(this.libs.users.getById(driverId));

            if (!driveDriver.error) {
                drive.driver = driveDriver.result;
            }
        }

        if (requester && requesterId) {
            let driveRequester = await resolve(
                this.libs.users.getById(requesterId)
            );

            if (!driveRequester.error) {
                drive.requester = driveRequester.result;
            }
        }

        if (truck && truckId) {
            let driveTruck = await resolve(this.libs.trucks.getById(truckId));

            if (!driveTruck.error) {
                drive.truck = driveTruck.result;
            }
        }

        return drive;
    }

    async start(driveId, options = {}) {
        let drive = await resolve(
            this.libs.drives.update({
                id: driveId,
                status: "started",
                startTime: new Date()
            })
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

        drive = await resolve(
            this.libs.drives.update({ id: driveId, endTime: new Date() })
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        let extensions = Object.values(drive.support);

        extensions = extensions
            .map(async extension => {
                extension = await resolve(
                    this.libs.supportExtensions.getByExtension(extension)
                );

                if (extension.error) {
                    return {
                        error: extension.error
                    };
                }

                extension = extension.result;

                extension = await resolve(
                    this.libs.supportExtensions.update(
                        Object.assign({}, { id: extension.id, active: false })
                    )
                );

                if (extension.error) {
                    return {
                        error: extension.error
                    };
                }

                extension = extension.result;

                return {
                    result: extension
                };
            })
            .filter(extension => extension.error);

        if (extensions.length > 0) {
            return {
                error: extensions
            };
        }

        let chargeId = drive.payment.chargeId;

        let charge = await resolve(this.libs.payments.fetchCharge(chargeId));

        if (charge.error) {
            return {
                error: charge.error
            };
        }

        charge = charge.result;

        let estimate = await resolve(this.libs.drives.estimate(driveId, true));

        if (estimate.error) {
            return {
                error: estimate.error
            };
        }

        let { base, mileage } = estimate;

        let estimatedCost = (Number(base) + Number(mileage)) * 100;
        let authorizedCost = Number(charge.amount);

        chargeId = drive.payment.chargeId;

        // TODO(isaiah) CAPTURE ONLY THE AMOUNT REQUIRED after re-estimating

        charge = await resolve(this.libs.payments.captureCharge(chargeId));

        if (charge.error) {
            return {
                error: charge.error
            };
        }

        charge = charge.result;

        let transfer = await resolve(
            this.libs.payment.createTransfer(
                price,
                drive.payment.chargeId,
                drive.driver.payeeAccountId,
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

    async charge(driveId, paymentSource, customer, options = {}) {
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
            this.libs.payments.authorizeCharge(
                paymentSource,
                drive.price,
                customer,
                {
                    drive: drive.id,
                    type: drive.driveType
                }
            )
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
            driverPayout: utils.stripe.getPayout("driver", drive.price),
            joeyPayout: utils.stripe.getPayout("joey", drive.price)
        });

        drive = await resolve(
            this.libs.drives.update(
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

    async estimate(driveId, complete = false) {
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

        let {
            route,
            helpers = 0,
            driveType,
            truck = {},
            endTime = false,
            startTime = false,
            commercialCargoItems = []
        } = drive;

        let { origin = {}, destination = {} } = route;

        let { price: truckPrice = {} } = truck;
        let { base: pricePerHour, mile: pricePerMile } = truckPrice;

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
            base: 0,
            mileage: 0
        };

        if (driveType === "consumer") {
            if (startTime && endTime) {
                let start = new Date(startTime);
                let end = new Date(endTime);

                let ms = end.getTime() - start.getTime();

                let time = Math.ceil(ms / 1000 / 60 / 60 - 1);

                if (time < 1) time = 1;

                estimate.base = Number(pricePerHour || 0) * time;

                estimate.base +=
                    Number(helpers || 0) * this._pricePerHelper * time;
            } else {
                estimate.base = Number(pricePerHour || 0);

                estimate.base += Number(helpers || 0) * this._pricePerHelper;
            }
        }

        if (driveType === "business") {
            let base = commercialCargoItems
                .map(({ height, width, length, weight, quantity }) => {
                    let volume = height / 12 * (width / 12) * (length / 12);

                    let volumeCost = volume * this._pricePerCubicFoot;
                    let weightCost = weight * this._pricePerPound;

                    let cost = volumeCost + weightCost;

                    let total = cost * quantity;

                    return Number(total.toFixed(2));
                })
                .reduce((a, b) => a + b, 0)
                .toFixed(2);

            estimate.base = Number(base);
        }

        let mileage = (distance * this._pricePerMile).toFixed(2);

        estimate.mileage = Number(mileage);

        drive = await resolve(
            this.store.update({
                id: driveId,
                price: Number(estimate.mileage || 0) +
                    Number(estimate.base || 0)
            })
        );

        if (drive.error) {
            return {
                error: drive.error
            };
        }

        drive = drive.result;

        return {
            result: estimate
        };
    }

    async driverStats(driverId, dates = {}) {
        let drives = await resolve(
            this.libs.drives.filterBy(
                { driverId, status: "delivered" },
                {},
                {},
                dates
            )
        );

        if (drives.error) {
            return {
                error: drives.error
            };
        }

        drives = drives.result;

        let stats = drives
            .map(drive => {
                let { payment, startTime, endTime } = drive;
                let start = new Date(start);
                let end = new Date(end);

                let time = start.getTime() - end.getTime();

                return {
                    price: payment.driverPayout,
                    duration: time
                };
            })
            .reduce(
                (a, b, idx, drives) => ({
                    trips: drives.length,
                    price: a.price + b.price,
                    duration: a.duration + b.duration
                }),
                {
                    price: 0,
                    duration: 0,
                    trips: 0
                }
            );

        return {
            result: stats
        };
    }
}

module.exports = Drive;
