const Utils = require("../../utils");

class Payment {
    constructor(args) {
        this.gateway = args.gateway;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async createAccount(data) {
        let account = await resolve(this.gateway.createAccount(data));

        if (account.errror) {
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
        let account = await resolve(this.gateway.updateAccount(id, data));

        if (account.errror) {
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
        let account = await resolve(this.gateway.deleteAccount(id));

        if (account.errror) {
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
        let account = await resolve(this.gateway.getAccountById(id));

        if (account.errror) {
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
        let accounts = await resolve(this.gateway.getAllAccounts(limit));

        if (accounts.errror) {
            return {
                error: accounts.error
            };
        }

        accounts = accounts.result;

        return {
            result: accounts
        };
    }

    async createCharge(source, amount, desc) {
        let charge = await resolve(
            this.gateway.createCharge(source, amount, desc)
        );

        if (charge.errror) {
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
        let transfer = await resolve(this.gateway.createTransfer(drive));

        if (transfer.errror) {
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
        let refund = await resolve(this.gateway.createRefund(drive));

        if (refund.errror) {
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

module.exports = Payment;
