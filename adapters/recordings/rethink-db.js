const RecordingStorePort = require("./store-port");
const { Recording } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbRecordingStoreAdapter extends RecordingStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Entity = Recording;
        this._Model = thinky.createModel(
            "Recording",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                driveId: type.string(),
                duration: type.number(),
                url: type.string()
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Model.ensureIndex("driveId");
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let recording = new this._Model(data);

        recording = await resolve(recording.save());

        if (recording.error) {
            return {
                error: recording.error
            };
        }

        recording = recording.result;

        return {
            result: this._modelToEntity(recording)
        };
    }

    async update(data) {
        let recording = new this._Model(data);

        recording = await resolve(this._Model.get(data.id));

        if (recording.error) {
            return {
                error: new Error("No recording with id.")
            };
        }

        recording = recording.result;

        recording = await resolve(recording.merge(data));

        if (recording.error) {
            return {
                error: recording.error
            };
        }

        recording = recording.result;

        recording = await resolve(
            this._Model.save(recording, { conflict: "update" })
        );

        if (recording.error) {
            return {
                error: recording.error
            };
        }

        recording = recording.result;

        return {
            result: this._modelToEntity(recording)
        };
    }

    async delete(id) {
        let recording = await resolve(this._Model.get(id));

        if (recording.error) {
            return {
                error: new Error("No recording with id.")
            };
        }

        recording = recording.result;

        recording = await resolve(recording.delete());

        if (recording.error) {
            return {
                error: recording.error
            };
        }

        recording = recording.result;

        return {
            result: this._modelToEntity(recording)
        };
    }

    async getById(id) {
        let recording = await resolve(this._Model.get(id));

        if (recording.error) {
            return {
                error: new Error("No recording with id.")
            };
        }

        recording = recording.result;

        return {
            result: this._modelToEntity(recording)
        };
    }

    async getAll() {
        let recordings = await resolve(new this._Query(this._Model).run());

        if (recordings.error) {
            return {
                error: recordings.error
            };
        }

        recordings = recordings.result;

        return {
            result: recordings.map(r => this._modelToEntity(r))
        };
    }

    async filterBy(query) {
        let recordings = await resolve(
            new this._Query(this._Model).filter(query)
        );

        if (recordings.error) {
            return {
                error: recordings.error
            };
        }

        recordings = recordings.result;

        return {
            result: recordings.map(r => this._modelToEntity(r))
        };
    }
}

module.exports = RethinkDbRecordingStoreAdapter;
