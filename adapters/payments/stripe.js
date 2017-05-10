const Utils = require("../../old-lib/utils");
const { merge } = require("lodash");

const defaults = {
    account: {
        managed: true,
        external_account: {
            object: "bank_account",
            country: "US",
            currency: "usd"
        },
        transfer_schedule: {
            monthly_anchor: 1,
            interval: "monthly"
        }
    },
    transfer: {
        currency: "usd"
    },
    charge: {
        currency: "usd"
    }
};

class StripePaymentGatewayAdapter {
    constructor(stripe) {
        this._Stripe = stripe;
    }

    async createAccount(data) {
        return await this._Stripe.accounts.create(
            merge(defaults.account, data)
        );
    }

    async updateAccount(id, data) {
        return await this._Stripe.accounts.update(id, data);
    }

    async deleteAccount(id) {
        return await this._Stripe.accounts.del(id);
    }

    async getAccountById(id) {
        return await this._Stripe.accounts.retrieve(id);
    }

    async getAllAccounts(limit) {
        return await this._Stripe.accounts.list({
            limit: limit
        });
    }

    async createCharge(drive, payment) {
        let charge = merge(defaults.charge, {
            amount: (drive.price * 100).toFixed(0),
            source: payment,
            metadata: {
                description: `Payment for Joey drive <${drive.id}>`
            }
        });

        return await Stripe.charges.create(charge);
    }

    async createTransfer(drive) {
        let driver = merge(defaults.transfer, {
            amount: Utils.stripe.getPayout("driver", drive.price),
            application_fee: Utils.stripe.getPayout("joey", drive.price),
            source_transaction: drive.payment.chargeId,
            destination: drive.driver.driver.connectId,
            description: `Driver <${drive.driver.id}> payment share for drive <${drive.id}>`
        });

        return await Stripe.transfers.create(driver);
    }

    async createRefund(drive) {
        return await Stripe.refunds.create({
            charge: drive.payment.charge_id
        });
    }
}
