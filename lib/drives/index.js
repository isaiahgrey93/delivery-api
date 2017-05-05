const DrivePort = require("./port");

class Drive extends DrivePort {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(drive) {
        let newDrive = new this.Entity(drive);

        try {
            newDrive = await this.store.create(newDrive);
            if (newDrive instanceof Error) throw newDrive;

            return newDrive;
        } catch (e) {
            return e;
        }
    }

    async update(drive) {
        let updatedDrive = new this.Entity(drive);

        try {
            return await this.store.update(updatedDrive);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedDrive = await this.store.delete(id);

            if (fetchedDrive instanceof Error) throw fetchedDrive;

            return fetchedDrive;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedDrive = await this.store.getById(id);

            if (fetchedDrive instanceof Error) throw fetchedDrive;

            return fetchedDrive;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedDrives = await this.store.getAll();

            if (fetchedDrives instanceof Error) throw fetchedDrives;

            return fetchedDrives;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Drive;
