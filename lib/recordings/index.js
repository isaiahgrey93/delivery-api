class Recording {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(recording) {
        let newRecording = new this.Entity(recording);

        try {
            newRecording = await this.store.create(newRecording);
            if (newRecording instanceof Error) throw newRecording;

            return newRecording;
        } catch (e) {
            return e;
        }
    }

    async update(recording) {
        let updatedRecording = new this.Entity(recording);

        try {
            return await this.store.update(updatedRecording);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedRecording = await this.store.delete(id);

            if (fetchedRecording instanceof Error) throw fetchedRecording;

            return fetchedRecording;
        } catch (e) {
            return e;
        }
    }

    async getById(id) {
        try {
            let fetchedRecording = await this.store.getById(id);

            if (fetchedRecording instanceof Error) throw fetchedRecording;

            return fetchedRecording;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedRecordings = await this.store.getAll();

            if (fetchedRecordings instanceof Error) throw fetchedRecordings;

            return fetchedRecordings;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Recording;
