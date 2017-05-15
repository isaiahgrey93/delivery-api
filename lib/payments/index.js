class Payment {
    constructor(args) {
        this.gateway = args.gateway;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async createAccount(data) {
        let account = await this.gateway.createAccount(data);

        return account;
    }

    async updateAccount(id, data) {
        let account = await this.gateway.updateAccount(id, data);

        return account;
    }

    async deleteAccount(id) {
        let account = await this.gateway.deleteAccount(id);

        return account;
    }

    async getAccountById(id) {
        let account = await this.gateway.getAccountById(id);

        return account;
    }

    async getAllAccounts(limit) {
        let accounts = await this.gateway.getAllAccounts(limit);

        return accounts;
    }

    async createCharge(drive, payment) {
        let charge = await this.gateway.createCharge(drive, payment);

        return charge;
    }

    async createTransfer(drive) {
        let transfer = await this.gateway.createTransfer(drive);

        return transfer;
    }

    async createRefund(drive) {
        let refund = await this.gateway.createRefund(drive);

        return refund;
    }
}

module.exports = Payment;
