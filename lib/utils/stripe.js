'use strict';
let driver_payout = 0.675;
let kiosk_payout = 0.125;

module.exports = {
  getPayout: (role, price) => {
    let stripe_fee = (price * 0.029) + 0.30;
    let payout_share = role === 'driver' ? driver_payout : kiosk_payout;

    return Math.floor((price - stripe_fee) * payout_share);
  }
}