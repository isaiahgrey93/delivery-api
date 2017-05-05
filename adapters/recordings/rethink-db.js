const { Recording } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbRecordingStoreAdapter {
    constructor(thinky) {
        const { type, r, Query } = thinky;

        this._Entity = Recording;
        this._model = thinky.createModel(
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

        this._Model.define("toJSON", function() {
            return omit(this, []);
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let recording = new this._Entity(data);
        try {
            recording = await recording.save();
            recording = recording.toJSON();

            return this._modelToEntity(recording);
        } catch (e) {
            return e;
        }
    }

    async update() {
        let recording = new this._Model(data);

        try {
            recording = await this._Model.get(data.id);
            recording = await recording.merge(data);
            recording = await this._Model.save(recording, {
                conflict: "update"
            });
            recording = recording.toJSON();

            return this._modelToEntity(recording);
        } catch (e) {
            return e;
        }
    }

    async delete() {
        try {
            let recording = await this._Model.get(id);
            recording = recording.delete();
            recording = recording.toJSON();

            return this._modelToEntity(recording);
        } catch (e) {
            return new Error("No recording with id.");
        }
    }

    async getById() {
        try {
            let recording = await this._Model.get(id);
            recording = recording.toJSON();

            return this._modelToEntity(recording);
        } catch (e) {
            return new Error("No recording with id.");
        }
    }

    async getAll() {
        try {
            let recordings = await new this._Query(this._Model).run();
            recordings = recordings.map(r => r.toJSON());

            return recordings.map(r => this._modelToEntity(r));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbRecordingStoreAdapter;
