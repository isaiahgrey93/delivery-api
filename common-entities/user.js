const sanitize = require("./helpers/sanitize");

function User(user = {}) {
    const {
        id,
        createdAt,
        updatedAt,
        email,
        password,
        nickname,
        lastname,
        firstname,
        middleInitial,
        dob,
        ssn,
        phone,
        avatar,
        driver,
        address
    } = user;

    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.lastname = lastname;
    this.firstname = firstname;
    this.middleInitial = middleInitial;
    this.dob = dob;
    this.ssn = ssn;
    this.phone = phone;
    this.avatar = avatar;

    if (address) {
        const { street, city, state, zip } = address;

        this.address = {};
        this.address.street = street;
        this.address.city = city;
        this.address.state = state;
        this.address.zip = zip;
    }

    if (driver) {
        const { license = false, notes, status, paymentAccountId } = driver;

        this.driver = {};
        this.driver.notes = notes;
        this.driver.status = status;
        this.driver.paymentAccountId = paymentAccountId;

        if (license) {
            const { expiryMonth, expiryYear, number, photo, state } = license;

            this.driver.license = {};
            this.driver.license.state = state;
            this.driver.license.photo = photo;
            this.driver.license.number = number;
            this.driver.license.expiryYear = expiryYear;
            this.driver.license.expiryMonth = expiryMonth;
        }
    }

    return sanitize(this);
}

module.exports = User;
