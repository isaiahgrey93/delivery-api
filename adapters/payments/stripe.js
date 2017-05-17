const PaymentGatewayPort = require("./gateway-port");
const Utils = require("../../utils");
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

class StripePaymentGatewayAdapter extends PaymentGatewayPort {
    constructor(stripe) {
        super();
        this._Stripe = stripe;
    }

    async createAccount(data) {
        let account = resolve(
            await this._Stripe.accounts.create(merge(defaults.account, data))
        );

        if (account.error) {
            return {
                error: account.error
            };
        }

        account = account.result;

        return {
            result: account
        };
    }

    async updateAccount(id, data) {
        let account = await resolve(this._Stripe.accounts.update(id, data));

        if (account.error) {
            return {
                error: account.error
            };
        }

        account = account.result;

        return {
            result: account
        };
    }

    async deleteAccount(id) {
        let account = await resolve(this._Stripe.accounts.del(id));

        if (account.error) {
            return {
                error: account.error
            };
        }

        account = account.result;

        return {
            result: account
        };
    }

    async getAccountById(id) {
        let account = await resolve(this._Stripe.accounts.retrieve(id));

        if (account.error) {
            return {
                error: account.error
            };
        }

        account = account.result;

        return {
            result: account
        };
    }

    async getAllAccounts(limit) {
        let accounts = await resolve(
            this._Stripe.accounts.list({
                limit: limit
            })
        );

        if (accounts.error) {
            return {
                error: accounts.error
            };
        }

        accounts = accounts.result;

        return {
            result: accounts
        };
    }

    async createCharge(drive, payment) {
        let charge = merge(defaults.charge, {
            amount: (drive.price * 100).toFixed(0),
            source: payment,
            metadata: {
                description: `Payment for Joey drive <${drive.id}>`
            }
        });

        let charge = await resolve(this._Stripe.charges.create(charge));

        if (charge.error) {
            return {
                error: charge.error
            };
        }

        charge = charge.result;

        return {
            result: charge
        };
    }

    async createTransfer(drive) {
        let driver = merge(defaults.transfer, {
            amount: Utils.stripe.getPayout("driver", drive.price),
            application_fee: Utils.stripe.getPayout("joey", drive.price),
            source_transaction: drive.payment.chargeId,
            destination: drive.driver.driver.connectId,
            description: `Driver <${drive.driver.id}> payment share for drive <${drive.id}>`
        });

        let transfer = await resolve(this._Stripe.transfers.create(driver));

        if (transfer.error) {
            return {
                error: transfer.error
            };
        }

        transfer = transfer.result;

        return {
            result: transfer
        };
    }

    async createRefund(drive) {
        let refund = await resolve(
            this._Stripe.refunds.create({
                charge: drive.payment.charge_id
            })
        );

        if (refund.error) {
            return {
                error: refund.error
            };
        }

        refund = refund.result;

        return {
            result: refund
        };
    }
}
