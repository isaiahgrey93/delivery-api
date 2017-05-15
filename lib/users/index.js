const { keyBy } = require("lodash");

class User {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
        this.passwordHash = args.passwordHash;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async authenticate(credentials) {
        let { email, password } = credentials;

        try {
            let user = await this.store.findByEmail(email);

            if (user instanceof Error) throw user;

            let authenticated = await this.passwordHash.doesPasswordMatchHash(
                password,
                user.password
            );

            if (authenticated === false) {
                throw new Error("Invalid email and password combination");
            }

            return user;
        } catch (e) {
            throw e;
        }
    }

    async resetPassword(email, newPassword) {
        try {
            let user = await this.store.findByEmail(email);

            if (user === false) {
                throw new Error("Email address is not registered.");
            }

            user.password = await this.passwordHash.generatePasswordHash(
                newPassword
            );

            user = new this.Entity(user);

            user = await this.libs.users.store.update(user);

            return user;
        } catch (e) {
            throw e;
        }
    }

    async create(user) {
        let newUser = new this.Entity(user);

        try {
            let isRegisteredEmail = await this.store.findByEmail(newUser.email);

            if (isRegisteredEmail) {
                throw new Error("Email address is already in use.");
            }

            let password = await this.passwordHash.generatePasswordHash(
                newUser.password
            );

            newUser.password = password;

            newUser = await this.store.create(newUser);

            return newUser;
        } catch (e) {
            throw e;
        }
    }

    async update(user, options = {}) {
        let updatedUser = new this.Entity(user);

        try {
            updatedUser = await this.store.update(updatedUser);

            return this.libs.users.populate(updatedUser, options.populate);
        } catch (e) {
            throw e;
        }
    }

    async delete(id) {
        try {
            let fetchedUser = await this.store.delete(id);

            if (fetchedUser instanceof Error) throw fetchedUser;

            return fetchedUser;
        } catch (e) {
            throw e;
        }
    }

    async getById(id, options = {}) {
        try {
            let fetchedUser = await this.store.getById(id);

            return this.libs.users.populate(fetchedUser, options.populate);
        } catch (e) {
            throw e;
        }
    }

    async getAll(options = {}) {
        try {
            let fetchedUsers = await this.store.getAll();

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            fetchedUsers = await Promise.all(
                fetchedUsers.map(async u => {
                    u = await this.libs.users.populate(u, options.populate);
                    return u;
                })
            );

            return fetchedUsers;
        } catch (e) {
            throw e;
        }
    }

    async getByRole(role, options = {}) {
        try {
            let fetchedUsers = await this.store.filterBy({ scope: [role] });

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            fetchedUsers = await Promise.all(
                fetchedUsers.map(async u => {
                    u = await this.libs.users.populate(u, options.populate);
                    return u;
                })
            );

            return fetchedUsers;
        } catch (e) {
            throw e;
        }
    }

    async filterBy(query, options = {}) {
        try {
            let fetchedUsers = await this.store.filterBy(query);

            if (fetchedUsers instanceof Error) throw fetchedUsers;

            fetchedUsers = await Promise.all(
                fetchedUsers.map(async u => {
                    u = await this.libs.users.populate(u, options.populate);
                    return u;
                })
            );

            return fetchedUsers;
        } catch (e) {
            throw e;
        }
    }

    async populate(user, relations) {
        let { vehicle, categories, presets } = keyBy(relations);

        if (categories) {
            let userCategories = await this.libs.categories.filterBy(
                {
                    userId: user.id
                },
                {
                    populate: [presets]
                }
            );

            user.categories = userCategories;
        }

        if (vehicle) {
            let [userVehicle] = await this.libs.vehicles.filterBy({
                userId: user.id
            });

            user.vehicle = userVehicle;
        }

        return user;
    }
}

module.exports = User;
