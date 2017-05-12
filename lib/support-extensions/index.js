class SupportExtension {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(supportExtension) {
        let newSupportExtension = new this.Entity(supportExtension);

        try {
            newSupportExtension = await this.store.create(newSupportExtension);
            if (newSupportExtension instanceof Error) throw newSupportExtension;

            return newSupportExtension;
        } catch (e) {
            return e;
        }
    }

    async update(supportExtension) {
        let updatedSupportExtension = new this.Entity(supportExtension);

        try {
            return await this.store.update(updatedSupportExtension);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedSupportExtension = await this.store.delete(id);

            if (fetchedSupportExtension instanceof Error)
                throw fetchedSupportExtension;

            return fetchedSupportExtension;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedSupportExtension = await this.store.getById(id);

            if (fetchedSupportExtension instanceof Error)
                throw fetchedSupportExtension;

            return fetchedSupportExtension;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedSupportExtensions = await this.store.getAll();

            if (fetchedSupportExtensions instanceof Error)
                throw fetchedSupportExtensions;

            return fetchedSupportExtensions;
        } catch (e) {
            return e;
        }
    }
}

module.exports = SupportExtension;
