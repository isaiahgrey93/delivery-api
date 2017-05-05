const sanitize = require("./sanitize");

module.exports = data => {
    let {
        route = {},
        support = {},
        payment = {},
        customer = {},
        commercial_cargo = {},
        consumer_cargo_items = [],
        drive_progress_confirmation = {}
    } = data;

    let { origin = {}, destination = {} } = route;

    return sanitize({
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        requesterId: data.requester_id,
        driverId: data.driver_id,
        customer: {
            phone: customer.phone,
            email: customer.email
        },
        payment: {
            chargeId: payment.charge_id,
            transferIds: payment.transfer_ids
        },
        price: data.price,
        status: data.status,
        startTime: data.start_time,
        endTime: data.end_time,
        driveProgressConfirmation: {
            pickupArrival: drive_progress_confirmation.pickup_arrival,
            pickupLoaded: drive_progress_confirmation.pickup_loaded,
            dropoff: drive_progress_confirmation.dropoff
        },
        driveType: data.drive_type,
        consumerCargo: {
            value: consumer_cargo.value,
            weight: consumer_cargo.weight,
            description: consumer_cargo.description
        },
        commercialCargoItems: data.commercial_cargo_items.map(item => ({
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
                geo: origin.object
            },
            destination: {
                name: destination.name,
                street: destination.street,
                city: destination.city,
                state: destination.state,
                zip: destination.zip,
                geo: type.object
            }
        },
        support: {
            driverExt: support.driver_ext,
            requesterExt: support.requester_ext,
            customerExt: support.customer_ext
        }
    });
};
