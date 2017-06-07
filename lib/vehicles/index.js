const { keyBy } = require("lodash");

class Vehicle {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(vehicle) {
        let newVehicle = new this.Entity(vehicle);

        newVehicle = await resolve(this.store.create(newVehicle));

        if (newVehicle.error) {
            return {
                error: newVehicle.error
            };
        }

        newVehicle = newVehicle.result;

        return {
            result: newVehicle
        };
    }

    async update(vehicle, options = {}) {
        let updatedVehicle = new this.Entity(vehicle);

        updatedVehicle = await resolve(this.store.update(updatedVehicle));

        if (updatedVehicle.error) {
            return {
                error: updatedVehicle.error
            };
        }

        updatedVehicle = updatedVehicle.result;

        updatedVehicle = await resolve(
            this.populate(updatedVehicle, options.populate)
        );

        if (updatedVehicle.error) {
            return {
                error: updatedVehicle.error
            };
        }

        updatedVehicle = updatedVehicle.result;

        return {
            result: updatedVehicle
        };
    }

    async delete(id) {
        let fetchedVehicle = await resolve(this.store.delete(id));

        if (fetchedVehicle.error) {
            return {
                error: fetchedVehicle.error
            };
        }

        fetchedVehicle = fetchedVehicle.result;

        return {
            result: fetchedVehicle
        };
    }

    async getById(id, options = {}) {
        let fetchedVehicle = await resolve(this.store.getById(id));

        if (fetchedVehicle.error) {
            return {
                error: fetchedVehicle.error
            };
        }

        fetchedVehicle = fetchedVehicle.result;

        fetchedVehicle = await resolve(
            this.populate(fetchedVehicle, options.populate)
        );

        if (fetchedVehicle.error) {
            return {
                error: fetchedVehicle.error
            };
        }

        fetchedVehicle = fetchedVehicle.result;

        return {
            result: fetchedVehicle
        };
    }

    async getAll(options = {}) {
        let fetchedVehicles = await resolve(this.store.getAll());

        if (fetchedVehicles.error) {
            return {
                error: fetchedVehicles.error
            };
        }

        fetchedVehicles = fetchedVehicles.result;

        fetchedVehicles = await Promise.all(
            fetchedVehicles.map(async v => {
                v = await resolve(
                    this.libs.vehicles.populate(v, options.populate)
                );

                if (v.error) {
                    return v.error;
                }

                return v.result;
            })
        );

        return {
            result: fetchedVehicles
        };
    }

    async filterBy(query, options = {}) {
        let fetchedVehicles = await resolve(this.store.filterBy(query));

        if (fetchedVehicles.error) {
            return {
                error: fetchedVehicles.error
            };
        }

        fetchedVehicles = fetchedVehicles.result;

        fetchedVehicles = await Promise.all(
            fetchedVehicles.map(async v => {
                v = await resolve(
                    this.libs.vehicles.populate(v, options.populate)
                );

                if (v.error) {
                    return v.error;
                }

                return v.result;
            })
        );

        return {
            result: fetchedVehicles
        };
    }

    async populate(vehicle, relations) {
        let { truck } = keyBy(relations);

        if (truck) {
            let truckType = await resolve(
                this.libs.trucks.getById(vehicle.truckId)
            );

            if (!truckType.error) {
                vehicle.truck = truckType.result;
            }
        }

        return vehicle;
    }
}

module.exports = Vehicle;
