const sanitize = require("./helpers/sanitize");

function Drive(drive) {
    const {
        id,
        createdAt,
        updatedAt,
        driverId,
        requesterId,
        truckId,
        helpers,
        startTime,
        endTime,
        price,
        status,
        driveType,
        commercialCargoItems,
        consumerCargo,
        route,
        support,
        payment,
        customer,
        driveProgressConfirmation
    } = drive;

    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.driverId = driverId;
    this.truckId = truckId;
    this.requesterId = requesterId;
    this.helpers = helpers;
    this.startTime = startTime;
    this.endTime = endTime;
    this.price = price;
    this.status = status;
    this.driveType = driveType;

    if (customer) {
        let { phone, email } = customer;

        this.customer = {};
        this.customer.phone = phone;
        this.customer.email = email;
    }

    if (payment) {
        let { chargeId, transferIds } = payment;

        this.payment = {};
        this.payment.chargeId = {};

        if (transferIds) {
            this.payment.transferIds = transferIds;
        }
    }

    if (route) {
        let { origin, destination, distance } = route;

        this.route = {};
        this.distance = distance;

        if (origin) {
            this.route.origin = {};
            this.route.origin.name = origin.name;
            this.route.origin.street = origin.street;
            this.route.origin.city = origin.city;
            this.route.origin.state = origin.state;
            this.route.origin.zip = origin.zip;
            this.route.origin.geo = origin.geo;
        }

        if (destination) {
            this.route.destination = {};
            this.route.destination.name = destination.name;
            this.route.destination.street = destination.street;
            this.route.destination.city = destination.city;
            this.route.destination.state = destination.state;
            this.route.destination.zip = destination.zip;
            this.route.destination.geo = destination.geo;
        }
    }

    if (support) {
        let { driverExt, requesterExt, customerExt } = support;

        this.support = {};
        this.support.driverExt = driverExt;
        this.support.customerExt = customerExt;
        this.support.requesterExt = requesterExt;
    }

    if (driveProgressConfirmation) {
        let {
            dropoff,
            pickupLoaded,
            pickupArrival
        } = driveProgressConfirmation;

        this.driveProgressConfirmation.pickupArrival = pickupArrival;
        this.driveProgressConfirmation.pickupLoaded = pickupLoaded;
        this.driveProgressConfirmation.dropoff = dropoff;
    }

    if (consumerCargo) {
        let { value, weight, description } = consumerCargo;

        this.consumerCargo = {};
        this.consumerCargo.value = value;
        this.consumerCargo.weight = weight;
        this.consumerCargo.description = description;
    }

    if (commercialCargoItems) {
        this.commercialCargoItems = [];

        commercialCargoItems.map(
            (item, index) => (this.commercialCargoItems[index] = item)
        );
    }

    return sanitize(this);
}

module.exports = Drive;
