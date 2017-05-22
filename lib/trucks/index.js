class Truck {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(truck) {
        let newTruck = new this.Entity(truck);

        newTruck = await resolve(this.store.create(newTruck));

        if (newTruck.error) {
            return {
                error: newTruck.error
            };
        }

        newTruck = newTruck.result;

        return {
            result: newTruck
        };
    }

    async update(truck, options = {}) {
        let updatedTruck = new this.Entity(truck);

        updatedTruck = await resolve(this.store.update(updatedTruck));

        if (updatedTruck.error) {
            return {
                error: updatedTruck.error
            };
        }

        updatedTruck = updatedTruck.result;

        return {
            result: updatedTruck
        };
    }

    async delete(id) {
        let fetchedTruck = await resolve(this.store.delete(id));

        if (fetchedTruck.error) {
            return {
                error: fetchedTruck.error
            };
        }

        fetchedTruck = fetchedTruck.result;

        return {
            result: fetchedTruck
        };
    }

    async getById(id, options = {}) {
        let fetchedTruck = await resolve(this.store.getById(id));

        if (fetchedTruck.error) {
            return {
                error: fetchedTruck.error
            };
        }

        fetchedTruck = fetchedTruck.result;

        return {
            result: fetchedTruck
        };
    }

    async getAll(options = {}) {
        let fetchedTrucks = await resolve(this.store.getAll());

        if (fetchedTrucks.error) {
            return {
                error: fetchedTrucks.error
            };
        }

        fetchedTrucks = fetchedTrucks.result;

        return {
            result: fetchedTrucks
        };
    }

    async filterBy(query, options = {}) {
        let fetchedTrucks = await resolve(this.store.filterBy(query));

        if (fetchedTrucks.error) {
            return {
                error: fetchedTrucks.error
            };
        }

        fetchedTrucks = fetchedTrucks.result;

        return {
            result: fetchedTrucks
        };
    }
}

module.exports = Truck;
