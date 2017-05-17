const { keyBy } = require("lodash");

class Drive {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(drive) {
        let newDrive = new this.Entity(drive);

        newDrive = await resolve(this.store.create(newDrive));

        if (newDrive.error) {
            return {
                error: newDrive.error
            };
        }

        newDrive = newDrive.result;

        return {
            result: newDrive
        };
    }

    async update(drive, options = {}) {
        let updatedDrive = new this.Entity(drive);

        updatedDrive = await resolve(this.store.update(updatedDrive));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        updatedDrive = resolve(this.populate(updatedDrive, options.populate));

        if (updatedDrive.error) {
            return {
                error: updatedDrive.error
            };
        }

        updatedDrive = updatedDrive.result;

        return {
            result: updatedDrive
        };
    }

    async delete(id) {
        let fetchedDrive = await resolve(this.store.delete(id));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        return {
            result: fetchedDrive
        };
    }

    async getById(id, options = {}) {
        let fetchedDrive = await resolve(this.store.getById(id));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        fetchedDrive = resolve(this.populate(fetchedDrive, options.populate));

        if (fetchedDrive.error) {
            return {
                error: fetchedDrive.error
            };
        }

        fetchedDrive = fetchedDrive.result;

        return {
            result: fetchedDrive
        };
    }

    async getAll(options = {}) {
        let fetchedDrives = await resolve(this.store.getAll());

        if (fetchedDrives.error) {
            return {
                error: fetchedDrives.error
            };
        }

        fetchedDrives = fetchedDrives.result;

        fetchedDrives = await Promise.all(
            fetchedDrives.map(async d => {
                d = await resolve(
                    this.libs.drives.populate(d, options.populate)
                );

                if (d.error) {
                    return u.error;
                }

                return d.result;
            })
        );

        return {
            result: fetchedDrives
        };
    }

    async filterBy(query, options = {}) {
        let fetchedDrives = await resolve(this.store.filterBy(query));

        if (fetchedDrives.error) {
            return {
                error: fetchedDrives.error
            };
        }

        fetchedDrives = fetchedDrives.result;

        fetchedDrives = await Promise.all(
            fetchedDrives.map(async c => {
                d = await resolve(
                    this.libs.drives.populate(d, options.populate)
                );

                if (d.error) {
                    return d.error;
                }

                return d.result;
            })
        );

        return {
            result: fetchedDrives
        };
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
