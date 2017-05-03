const UserPort = require("./port");

class User extends UserPort {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async authenticate(credentials) {
        let { email, password } = credentials;

        try {
            let user = await this.store.findByEmail(email);

            if (user instanceof Error) throw user;

            user = await this.store.authenticate(user, password);

            return user;
        } catch (e) {
            return e;
        }
    }

    async create(user) {
        let newUser = new this.Entity(user);

        try {
            newUser = await this.store.create(newUser);

            if (newUser instanceof Error) throw newUser;

            return newUser;
        } catch (e) {
            return e;
        }
    }

    async update(user) {
        let updatedUser = new this.Entity(user);

        try {
            return await this.store.update(updatedUser);
        } catch (e) {
            return e;
        }
    }
}

module.exports = User;
