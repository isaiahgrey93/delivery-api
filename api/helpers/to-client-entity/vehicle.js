const sanitize = require("../sanitize");
const Truck = require("./truck");

module.exports = data => {
    let { licensePlate = {}, truck = {} } = data;

    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        user_id: data.userId,
        truck_id: data.truckId,
        truck: Truck(truck),
        make: data.make,
        model: data.model,
        year: data.year,
        license_plate: {
            number: licensePlate.number,
            state: licensePlate.state
        },
        insurance: data.insurance,
        registration: data.registration,
        images: data.images
    });
};
