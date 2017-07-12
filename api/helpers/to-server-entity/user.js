const sanitize = require("../sanitize");

module.exports = data => {
    let { drivers_license = {} } = data;

    return sanitize({
        id: data.id,
        email: data.email,
        scope: data.scope,
        password: data.password,
        nickname: data.nickname,
        lastname: data.lastname,
        firstname: data.firstname,
        middleInitial: data.middle_initial,
        dob: data.dob,
        ssn: data.social_security_number,
        phone: data.phone,
        avatar: data.profile_photo,
        geo: data.geo,
        isOnline: data.isOnline,
        payerAccountId: data.payer_account_id,
        driver: {
            notes: data.notes,
            status: data.status,
            payeeAccountId: data.connect_id,
            license: {
                state: drivers_license.state,
                photo: drivers_license.photo,
                number: drivers_license.number,
                expiration: drivers_license.expiration
            }
        },
        address: data.address
    });
};
