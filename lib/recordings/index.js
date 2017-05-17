class Recording {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(recording) {
        let newRecording = new this.Entity(recording);

        newRecording = await resolve(this.store.create(newRecording));

        if (newRecording.error) {
            return {
                error: newRecording.error
            };
        }

        newRecording = newRecording.result;

        return {
            result: newRecording
        };
    }

    async update(recording, options = {}) {
        let updatedRecording = new this.Entity(recording);

        updatedRecording = await resolve(this.store.update(updatedRecording));

        if (updatedRecording.error) {
            return {
                error: updatedRecording.error
            };
        }

        updatedRecording = updatedRecording.result;

        updatedRecording = resolve(
            this.populate(updatedRecording, options.populate)
        );

        if (updatedRecording.error) {
            return {
                error: updatedRecording.error
            };
        }

        updatedRecording = updatedRecording.result;

        return {
            result: updatedRecording
        };
    }

    async delete(id) {
        let fetchedRecording = await resolve(this.store.delete(id));

        if (fetchedRecording.error) {
            return {
                error: fetchedRecording.error
            };
        }

        fetchedRecording = fetchedRecording.result;

        return {
            result: fetchedRecording
        };
    }

    async getById(id, options = {}) {
        let fetchedRecording = await resolve(this.store.getById(id));

        if (fetchedRecording.error) {
            return {
                error: fetchedRecording.error
            };
        }

        fetchedRecording = fetchedRecording.result;

        fetchedRecording = resolve(
            this.populate(fetchedRecording, options.populate)
        );

        if (fetchedRecording.error) {
            return {
                error: fetchedRecording.error
            };
        }

        fetchedRecording = fetchedRecording.result;

        return {
            result: fetchedRecording
        };
    }

    async getAll(options = {}) {
        let fetchedRecordings = await resolve(this.store.getAll());

        if (fetchedRecordings.error) {
            return {
                error: fetchedRecordings.error
            };
        }

        fetchedRecordings = fetchedRecordings.result;

        fetchedRecordings = await Promise.all(
            fetchedRecordings.map(async r => {
                r = await resolve(
                    this.libs.recordings.populate(r, options.populate)
                );

                if (r.error) {
                    return r.error;
                }

                return r.result;
            })
        );

        return {
            result: fetchedRecordings
        };
    }
}

module.exports = Recording;
