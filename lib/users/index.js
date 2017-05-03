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

    async resetPassword(email, newPassword) {
        try {
            let user = await this.store.resetPassword(email, newPassword);

            if (user instanceof Error) throw user;

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

    async delete(id) {
        try {
            let fetchedUser = await this.store.delete(id);

            if (fetchedUser instanceof Error) throw fetchedUser;

            return fetchedUser;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedUser = await this.store.getById(id);

            if (fetchedUser instanceof Error) throw fetchedUser;

            return fetchedUser;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedUsers = await this.store.getAll();

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            return fetchedUsers;
        } catch (e) {
            return e;
        }
    }

    async getByRole(role) {
        try {
            let fetchedUsers = await this.store.filterBy({ scope: [role] });

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            return fetchedUsers;
        } catch (e) {
            return e;
        }
    }

    async filterBy(query) {
        try {
            let fetchedUsers = await this.store.filterBy(query);

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            return fetchedUsers;
        } catch (e) {
            return e;
        }
    }
}

module.exports = User;
