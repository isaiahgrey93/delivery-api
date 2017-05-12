"use strict";
let driver_payout = 0.75;
let joey_payout = 0.25;

module.exports = {
    getPayout: (role, price) => {
        return role === "driver"
            ? Math.round(driver_payout * (price * 100))
            : Math.round(joey_payout * (price * 100));
    }
};
