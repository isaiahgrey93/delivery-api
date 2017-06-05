const sanitize = require("../sanitize");

module.exports = data => {
    let { license_plate = {} } = data;

    return sanitize({
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
        truckId: data.truck_id,
        truck: data.truck,
        make: data.make,
        model: data.model,
        year: data.year,
        licensePlate: {
            number: license_plate.number,
            state: license_plate.state
        },
        insurance: data.insurance,
        registration: data.registration,
        images: data.images
    });
};
