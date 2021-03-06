class Preset {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(preset) {
        let newPreset = new this.Entity(preset);

        newPreset = await resolve(this.store.create(newPreset));

        if (newPreset.error) {
            return {
                error: newPreset.error
            };
        }

        newPreset = newPreset.result;

        return {
            result: newPreset
        };
    }

    async update(preset, options = {}) {
        let updatedPreset = new this.Entity(preset);

        updatedPreset = await resolve(this.store.update(updatedPreset));

        if (updatedPreset.error) {
            return {
                error: updatedPreset.error
            };
        }

        updatedPreset = updatedPreset.result;

        return {
            result: updatedPreset
        };
    }

    async delete(id) {
        let fetchedPreset = await resolve(this.store.delete(id));

        if (fetchedPreset.error) {
            return {
                error: fetchedPreset.error
            };
        }

        fetchedPreset = fetchedPreset.result;

        return {
            result: fetchedPreset
        };
    }

    async getById(id, options = {}) {
        let fetchedPreset = await resolve(this.store.getById(id));

        if (fetchedPreset.error) {
            return {
                error: fetchedPreset.error
            };
        }

        fetchedPreset = fetchedPreset.result;

        return {
            result: fetchedPreset
        };
    }

    async getAll(options = {}) {
        let fetchedPresets = await resolve(this.store.getAll());

        if (fetchedPresets.error) {
            return {
                error: fetchedPresets.error
            };
        }

        fetchedPresets = fetchedPresets.result;

        console.log(fetchedPresets);

        return {
            result: fetchedPresets
        };
    }

    async filterBy(query, options = {}) {
        let fetchedPresets = await resolve(this.store.filterBy(query));

        if (fetchedPresets.error) {
            return {
                error: fetchedPresets.error
            };
        }

        fetchedPresets = fetchedPresets.result;

        return {
            result: fetchedPresets
        };
    }
}

module.exports = Preset;
