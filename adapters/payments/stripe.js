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
    bank: {
        type: "bank_account",
        currency: "usd"
    },
    card: {
        type: "card"
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

    async createCustomer(data) {
        let customer = await resolve(this._Stripe.customers.create(data));

        if (customer.error) {
            return {
                error: customer.error
            };
        }

        customer = customer.result;
    }

    async fetchCustomer(customerId) {
        let customer = await resolve(
            this._Stripe.customers.retrieve(customerId)
        );

        if (customer.error) {
            return {
                error: customer.error
            };
        }

        customer = customer.result;
    }

    async addCardSource(customerId, cardDetails) {
        let cardSource = await resolve(
            this._Stripe.customers.createSource(customerId, {
                source: merge(defaults.card, cardDetails)
            })
        );

        if (cardSource.error) {
            return {
                error: cardSource.error
            };
        }

        cardSource = cardSource.result;

        return {
            result: cardSource
        };
    }

    async addBankSource(customerId, bankDetails) {
        let bankSource = await resolve(
            this._Stripe.customers.createSource(customerId, {
                source: merge(defaults.bank, bankDetails)
            })
        );

        if (bankSource.error) {
            return {
                error: bankSource.error
            };
        }

        bankSource = bankSource.result;

        return {
            result: bankSource
        };
    }

    async createAccount(data) {
        let account = await resolve(
            this._Stripe.accounts.create(merge(defaults.account, data))
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

    async updateAccount(accountId, data) {
        let account = await resolve(
            this._Stripe.accounts.update(accountId, data)
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

    async deleteAccount(accountId) {
        let account = await resolve(this._Stripe.accounts.del(accountId));

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

    async getAccountById(accountId) {
        let account = await resolve(this._Stripe.accounts.retrieve(accountId));

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

    async fetchCharge(chargeId) {
        let charge = await resolve(this._Stripe.charges.retrieve(chargeId));

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
