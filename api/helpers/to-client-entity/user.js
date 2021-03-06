const sanitize = require("../sanitize");
const Category = require("./category");
const Vehicle = require("./vehicle");

module.exports = data => {
    let { driver = {}, address = {}, vehicle = {}, categories = [] } = data;
    let { license = {} } = driver;

    return sanitize({
        id: data.id,
        email: data.email,
        scope: data.scope,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        payer_account_id: data.payerAccountId,
        connect_id: driver.payeeAccountId,
        firstname: data.firstname,
        middle_initial: data.middleInitial,
        lastname: data.lastname,
        nickname: data.nickname,
        profile_photo: data.avatar,
        phone: data.phone,
        dob: data.dob,
        notes: driver.notes,
        categories: categories.map(c => Category(c)),
        vehicle: Vehicle(vehicle),
        geo: data.geo,
        isOnline: data.isOnline,
        drivers_license: {
            expiration: license.expiration,
            number: license.number,
            photo: license.photo,
            state: license.state
        },
        address: {
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip
        },
        status: driver.status,
        social_security_number: data.ssn
    });
};
