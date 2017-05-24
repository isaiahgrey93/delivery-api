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

        newSupportExtension = await resolve(
            this.store.create(newSupportExtension)
        );

        if (newSupportExtension.error) {
            return {
                error: newSupportExtension.error
            };
        }

        newSupportExtension = newSupportExtension.result;

        return {
            result: newSupportExtension
        };
    }

    async update(supportExtension, options = {}) {
        let updatedSupportExtension = new this.Entity(supportExtension);

        updatedSupportExtension = await resolve(
            this.store.update(updatedSupportExtension)
        );

        if (updatedSupportExtension.error) {
            return {
                error: updatedSupportExtension.error
            };
        }

        updatedSupportExtension = updatedSupportExtension.result;

        updatedSupportExtension = resolve(
            this.populate(updatedSupportExtension, options.populate)
        );

        if (updatedSupportExtension.error) {
            return {
                error: updatedSupportExtension.error
            };
        }

        updatedSupportExtension = updatedSupportExtension.result;

        return {
            result: updatedSupportExtension
        };
    }

    async delete(id) {
        let fetchedSupportExtension = await resolve(this.store.delete(id));

        if (fetchedSupportExtension.error) {
            return {
                error: fetchedSupportExtension.error
            };
        }

        fetchedSupportExtension = fetchedSupportExtension.result;

        return {
            result: fetchedSupportExtension
        };
    }

    async getById(id, options = {}) {
        let fetchedSupportExtension = await resolve(this.store.getById(id));

        if (fetchedSupportExtension.error) {
            return {
                error: fetchedSupportExtension.error
            };
        }

        fetchedSupportExtension = fetchedSupportExtension.result;

        fetchedSupportExtension = resolve(
            this.populate(fetchedSupportExtension, options.populate)
        );

        if (fetchedSupportExtension.error) {
            return {
                error: fetchedSupportExtension.error
            };
        }

        fetchedSupportExtension = fetchedSupportExtension.result;

        return {
            result: fetchedSupportExtension
        };
    }

    async getAll(options = {}) {
        let fetchedSupportExtensions = await resolve(this.store.getAll());

        if (fetchedSupportExtensions.error) {
            return {
                error: fetchedSupportExtensions.error
            };
        }

        fetchedSupportExtensions = fetchedSupportExtensions.result;

        fetchedSupportExtensions = await Promise.all(
            fetchedSupportExtensions.map(async s => {
                s = await resolve(
                    this.libs.supportExtensions.populate(s, options.populate)
                );

                if (s.error) {
                    return s.error;
                }

                return s.result;
            })
        );

        return {
            result: fetchedSupportExtensions
        };
    }

    async filterBy(query, options = {}, limit) {
        let fetchedSupportExtensions = await resolve(
            this.store.filterBy(query, limit)
        );

        if (fetchedSupportExtensions.error) {
            return {
                error: fetchedSupportExtensions.error
            };
        }

        fetchedSupportExtensions = fetchedSupportExtensions.result;

        fetchedSupportExtensions = await Promise.all(
            fetchedSupportExtensions.map(async s => {
                s = await resolve(
                    this.libs.supportExtensions.populate(s, options.populate)
                );

                if (s.error) {
                    return s.error;
                }

                return s.result;
            })
        );

        return {
            result: fetchedSupportExtensions
        };
    }
}

module.exports = SupportExtension;
