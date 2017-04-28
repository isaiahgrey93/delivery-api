const { Recording } = require("../../common-entities");

class RethinkDbRecordingStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

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

        this._Entity = Recording;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbRecordingStoreAdapter;
