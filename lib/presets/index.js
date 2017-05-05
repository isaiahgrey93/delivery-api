const PresetPort = require("./port");

class Preset extends PresetPort {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(preset) {
        let newPreset = new this.Entity(preset);

        try {
            newPreset = await this.store.create(newPreset);
            if (newPreset instanceof Error) throw newPreset;

            return newPreset;
        } catch (e) {
            return e;
        }
    }

    async update(preset) {
        let updatedPreset = new this.Entity(preset);

        try {
            return await this.store.update(updatedPreset);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedPreset = await this.store.delete(id);

            if (fetchedPreset instanceof Error) throw fetchedPreset;

            return fetchedPreset;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedPreset = await this.store.getById(id);

            if (fetchedPreset instanceof Error) throw fetchedPreset;

            return fetchedPreset;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedPresets = await this.store.getAll();

            if (fetchedPresets instanceof Error) throw fetchedPresets;

            return fetchedPresets;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Preset;
