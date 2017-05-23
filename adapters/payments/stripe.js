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

    async authorizeCharge(source, amount, meta) {
        let options = merge(defaults.charge, {
            amount: (amount * 100).toFixed(0),
            source: source,
            metadata: meta
        });

        let charge = await resolve(this._Stripe.charges.create(option));

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

    async captureCharge(chargeId) {
        let charge = await resolve(this._Stripe.charges.capture(chargeId));

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

    async createTransfer(amount, charge, destination, meta) {
        let params = merge(defaults.transfer, {
            metadata: meta,
            destination: destination,
            source_transaction: charge,
            amount: Utils.stripe.getPayout("driver", amount),
            application_fee: Utils.stripe.getPayout("joey", amount)
        });

        let transfer = await resolve(this._Stripe.transfers.create(params));

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
}

module.exports = StripePaymentGatewayAdapter;
