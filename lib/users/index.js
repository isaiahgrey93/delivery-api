const UserPort = require("./port");

class User extends UserPort {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(user) {
        console.log(this);
        let newUser = new this.Entity(user);

        try {
            return await this.store.create(user);
        } catch (e) {
            return e;
        }
    }
}

module.exports = User;
