const PasswordHashLibPort = require("./lib-port");

class BcryptPasswordHashAdapter extends PasswordHashLibPort {
    constructor(bcrypt) {
        super();
        this._Bcrypt = bcrypt;
    }

    async generatePasswordHash(password) {
        let salt = await resolve(this._Bcrypt.genSalt(10));

        if (salt.error) {
            return {
                error: salt.error
            };
        }

        salt = salt.result;

        let hash = await resolve(this._Bcrypt.hash(password, salt));

        if (hash.error) {
            return {
                error: hash.error
            };
        }

        hash = hash.result;

        return {
            result: hash
        };
    }

    async doesPasswordMatchHash(password, hash) {
        let { error } = await resolve(this._Bcrypt.compare(password, hash));

        if (error) {
            return {
                result: false
            };
        }

        return {
            result: true
        };
    }
}

module.exports = BcryptPasswordHashAdapter;
