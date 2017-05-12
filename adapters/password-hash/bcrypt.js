const PasswordHashLibPort = require("./lib-port");

class BcryptPasswordHashAdapter extends PasswordHashLibPort {
    constructor(bcrypt) {
        super();
        this._Bcrypt = bcrypt;
    }

    async generatePasswordHash(password) {
        let salt = await this._Bcrypt.genSalt(10);
        let hash = await this._Bcrypt.hash(password, salt);

        return hash;
    }

    async doesPasswordMatchHash(password, hash) {
        try {
            await this._Bcrypt.compare(password, hash);

            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = BcryptPasswordHashAdapter;
