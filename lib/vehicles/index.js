class Vehicle {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(vehicle) {
        let newVehicle = new this.Entity(vehicle);

        try {
            newVehicle = await this.store.create(newVehicle);
            if (newVehicle instanceof Error) throw newVehicle;

            return newVehicle;
        } catch (e) {
            return e;
        }
    }

    async update(vehicle) {
        let updatedVehicle = new this.Entity(vehicle);

        try {
            return await this.store.update(updatedVehicle);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedVehicle = await this.store.delete(id);

            if (fetchedVehicle instanceof Error) throw fetchedVehicle;

            return fetchedVehicle;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedVehicle = await this.store.getById(id);

            if (fetchedVehicle instanceof Error) throw fetchedVehicle;

            return fetchedVehicle;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedVehicles = await this.store.getAll();

            if (fetchedVehicles instanceof Error) throw fetchedVehicles;

            return fetchedVehicles;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Vehicle;
