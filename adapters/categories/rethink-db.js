const { Category } = require("../../common-entities");

class RethinkDbCategoryStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
            "Category",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                description: type.string(),
                userId: type.string(),
                name: type.string(),
                image: type.string()
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Entity = Category;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbCategoryStoreAdapter;
