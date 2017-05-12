"use strict";

const JWT = require("jsonwebtoken");
const uuid = require("uuid");

module.exports = {
    sanitize: data => {
        if (data instanceof Array) {
            return data.map(user => {
                delete user["password"];
                delete user["password_reset"];
                return user;
            });
        } else {
            delete data["password"];
            delete data["password_reset"];
            return data;
        }
    },
    hasAccount: user => {
        if (!user.connect_id)
            throw new Error(
                `No connect account found for user with id: <${user.id}>`
            );
        else return user;
    },
    grantJSONWebToken: user => {
        return JWT.sign(user, process.env.JWT_SECRET, { algorithm: "HS256" });
    },
    generatePasswordResetToken: () => {
        return {
            token: uuid.v4(),
            expiry: xHoursFromNow(24)
        };
    },
    validatePasswordResetToken: user => {
        let token = user.password_reset.token;
        let expiry = new Date(user.password_reset.expiry).getTime();
        let now = new Date().getTime();

        if (now > expiry) throw new Error(`Token <${token}> has expired.`);
        else return user;
    }
};

const xHoursFromNow = hours => {
    let now = new Date().getTime();
    let expiresInMilliseconds = hours * 60 * 60 * 1000;

    return new Date(now + expiresInMilliseconds).toISOString();
};
