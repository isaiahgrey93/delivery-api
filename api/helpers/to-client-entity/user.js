const sanitize = require("../sanitize");

module.exports = data => {
    let { driver = {}, address = {} } = data;
    let { license = {} } = driver;

    return sanitize({
        id: data.id,
        email: data.email,
        scope: data.scope,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        payee_account_id: driver.payeeAccountId,
        firstname: data.firstname,
        middle_initial: data.middleInitial,
        lastname: data.lastname,
        nickname: data.nickname,
        profile_photo: data.avatar,
        phone: data.phone,
        dob: data.dob,
        notes: driver.notes,
        categories: data.categories,
        vehicle: data.vehicle,
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
