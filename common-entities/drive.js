const sanitize = require("./helpers/sanitize");

function Drive(drive) {
    const {
        id,
        createdAt,
        updatedAt,
        driverId,
        requesterId,
        startTime,
        endTime,
        price,
        status,
        items,
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
    this.requesterId = requesterId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.price = price;
    this.status = status;

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

        this.routes = {};
        this.distance = distance;

        if (origin) {
            this.routes.origin = {};
            this.route.origin.name = name;
            this.route.origin.street = street;
            this.route.origin.city = city;
            this.route.origin.state = state;
            this.route.origin.zip = zip;
            this.route.origin.geo = geo;
        }

        if (destination) {
            this.routes.destination = {};
            this.route.destination.name = name;
            this.route.destination.street = street;
            this.route.destination.city = city;
            this.route.destination.state = state;
            this.route.destination.zip = zip;
            this.route.destination.geo = geo;
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

    if (items) {
        this.items = [];
        items.map((item, index) => (this.items[index] = item));
    }

    return sanitize(this);
}
