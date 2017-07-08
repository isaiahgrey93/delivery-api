class Payment {
    constructor(args) {
        this.gateway = args.gateway;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async createCustomer(userId) {
        let user = await resolve(this.libs.users.getById(userId));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        let customer = await resolve(
            this.gateway.createCustomer({ email: user.email })
        );

        if (customer.error) {
            return {
                error: customer.error
            };
        }

        customer = customer.result;

        user = await resolve(
            this.libs.users.update({ id: user.id, payerAccountId: customer.id })
        );

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: customer
        };
    }

    async updateCustomer(userId, data) {
        let user = await resolve(this.libs.users.getById(userId));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        let customer = await resolve(
            this.gateway.updateCustomer(user.payerAccountId, data)
        );

        if (customer.error) {
            return {
                error: customer.error
            };
        }

        customer = customer.result;

        return {
            result: customer
        };
    }

    async getCustomerById(id) {
        let user = await resolve(this.libs.users.getById(id));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        let customer = await resolve(
            this.gateway.getCustomerById(user.payerAccountId)
        );

        if (customer.error) {
            return {
                error: customer.error
            };
        }

        customer = customer.result;

        return {
            result: customer
        };
    }

    async addCustomerSource(userId, sourceDetails) {
        let user = await resolve(this.libs.users.getById(userId));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        let source = await resolve(
            this.gateway.addCustomerSource(user.payerAccountId, sourceDetails)
        );

        if (source.error) {
            return {
                error: source.error
            };
        }

        source = source.result;

        return {
            result: source
        };
    }

    async createAccount(data, userId) {
        let account = await resolve(this.gateway.createAccount(data));

        if (account.errror) {
            return {
                error: account.error
            };
        }

        account = account.result;

        let user = await resolve(this.libs.users.getById(userId));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        let { driver = {} } = user;

        driver = Object.assign({}, driver, { payeeAccountId: account.id });

        user = await resolve(this.libs.users.update({ id: user.id, driver }));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

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

    async authorizeCharge(source, amount, customer, meta) {
        let charge = await resolve(
            this.gateway.authorizeCharge(source, amount, customer, meta)
        );

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
        let charge = await resolve(this.gateway.captureCharge(chargeId));

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
        let charge = await resolve(this.gateway.fetchCharge(chargeId));

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
