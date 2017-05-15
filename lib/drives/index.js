const { keyBy } = require("lodash");

class Drive {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(drive, options = {}) {
        let newDrive = new this.Entity(drive);

        try {
            newDrive = await this.store.create(newDrive);
            if (newDrive instanceof Error) throw newDrive;

            return this.libs.drives.populate(newDrive, options.populate);
        } catch (e) {
            return e;
        }
    }

    async update(drive, options = {}) {
        let updatedDrive = new this.Entity(drive);

        try {
            updatedDrive = await this.store.update(updatedDrive);

            return this.libs.drives.populate(updatedDrive, options.populate);
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

    async getById(id, options = {}) {
        try {
            let fetchedDrive = await this.store.getById(id);

            if (fetchedDrive instanceof Error) throw fetchedDrive;

            return this.libs.drives.populate(fetchedDrive, options.populate);
        } catch (e) {
            return e;
        }
    }

    async getAll(options = {}) {
        try {
            let fetchedDrives = await this.store.getAll();

            if (fetchedDrives instanceof Error) throw fetchedDrives;

            fetchedDrives = await Promise.all(
                fetchedDrives.map(async d => {
                    d = await this.libs.drives.populate(d, options.populate);
                    return d;
                })
            );

            return fetchedDrives;
        } catch (e) {
            return e;
        }
    }

    async filterBy(query, options = {}) {
        try {
            let fetchedDrives = await this.store.filterBy(query);

            if (fetchedDrives instanceof Error) throw fetchedDrives;

            fetchedDrives = await Promise.all(
                fetchedDrives.map(async d => {
                    d = await this.libs.drives.populate(d, options.populate);
                    return d;
                })
            );

            return fetchedDrives;
        } catch (e) {
            throw e;
        }
    }

    async populate(drive, relations) {
        let { driver, requester } = keyBy(relations);
        let { driverId, requesterId } = drive;

        if (driver && driverId) {
            let driveDriver = await this.libs.users.getById(driverId);

            drive.driver = driveDriver;
        }

        if (requester && requesterId) {
            let driveRequester = await this.libs.users.getById(requesterId);

            drive.requester = driveRequester;
        }

        return drive;
    }
}

module.exports = Drive;
