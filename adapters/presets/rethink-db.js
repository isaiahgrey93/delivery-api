const { Preset } = require("../../common-entities");

class RethinkDbPresetStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
            "Preset",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                categoryId: type.string(),
                name: type.string(),
                width: type.string(),
                height: type.string(),
                length: type.string(),
                weight: type.string(),
                image: type.string()
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Entity = Preset;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbPresetStoreAdapter;
