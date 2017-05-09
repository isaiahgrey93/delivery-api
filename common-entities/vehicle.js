const sanitize = require("./helpers/sanitize");

function Vehicle(vehicle) {
    const {
        id,
        createdAt,
        updatedAt,
        userId,
        make,
        model,
        year,
        images,
        insurance,
        registration,
        licensePlate
    } = vehicle;

    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.make = make;
    this.model = model;
    this.year = year;
    this.images = images;
    this.insurance = insurance;
    this.registration = registration;

    if (licensePlate) {
        const { number, state } = licensePlate;

        this.licensePlate = {};
        this.licensePlate.state = state;
        this.licensePlate.number = number;
    }

    return sanitize(this);
}

module.exports = Vehicle;
