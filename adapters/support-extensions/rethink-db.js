const { SupportExtension } = require("../../common-entities");

class RethinkDbSupportExtensionStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
            "SupportExtension",
            {
                id: type.string().required().default(() => r.uuid()),
                extension: type.any().required(),
                active: type.boolean().required().default(false)
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Entity = SupportExtension;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbSupportExtensionStoreAdapter;
