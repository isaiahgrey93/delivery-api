const sanitize = require("../sanitize");
const User = require("./user");
const Truck = require("./truck");

module.exports = data => {
    let {
        route = {},
        truck = {},
        driver = {},
        requester = {},
        support = {},
        payment = {},
        customer = {},
        consumerCargo = {},
        commercialCargoItems = [],
        driveProgressConfirmation = {}
    } = data;

    let { origin = {}, destination = {} } = route;

    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        requester_id: data.requesterId,
        driver_id: data.driverId,
        truck_id: data.truckId,
        requester: User(requester),
        driver: User(driver),
        truck: Truck(truck),
        helpers: data.helpers,
        customer: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email
        },
        payment: {
            charge_id: payment.chargeId,
            transfer_ids: payment.transferIds
        },
        rating: data.rating,
        price: data.price,
        status: data.status,
        start_time: data.startTime,
        end_time: data.endTime,
        drive_progress_confirmation: {
            pickup_arrival: driveProgressConfirmation.pickupArrival,
            pickup_loaded: driveProgressConfirmation.pickupLoaded,
            dropoff: driveProgressConfirmation.dropoff
        },
        drive_type: data.driveType,
        consumer_cargo: {
            value: consumerCargo.value,
            weight: consumerCargo.weight,
            images: consumerCargo.images,
            description: consumerCargo.description
        },
        commercial_cargo_items: commercialCargoItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            height: item.height,
            width: item.width,
            length: item.length,
            weight: item.weight,
            value: item.value,
            notes: item.notes,
            images: item.images
        })),
        route: {
            distance: route.distance,
            origin: {
                name: origin.name,
                street: origin.street,
                city: origin.city,
                state: origin.state,
                zip: origin.zip,
                geo: origin.geo
            },
            destination: {
                name: destination.name,
                street: destination.street,
                city: destination.city,
                state: destination.state,
                zip: destination.zip,
                geo: destination.geo
            }
        },
        support: {
            driver_ext: support.driverExt,
            requester_ext: support.requesterExt,
            customer_ext: support.customerExt
        }
    });
};
