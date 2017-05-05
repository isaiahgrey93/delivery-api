const { Category } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbCategoryStoreAdapter {
    constructor(thinky) {
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Category;
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

        this._Model.define("toJSON", function() {
            return omit(this, []);
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let category = new this._Entity(data);
        try {
            category = await category.save();
            category = category.toJSON();

            return this._modelToEntity(category);
        } catch (e) {
            return e;
        }
    }

    async update() {
        let category = new this._Model(data);

        try {
            category = await this._Model.get(data.id);
            category = await category.merge(data);
            category = await this._Model.save(category, { conflict: "update" });
            category = category.toJSON();

            return this._modelToEntity(category);
        } catch (e) {
            return e;
        }
    }

    async delete() {
        try {
            let category = await this._Model.get(id);
            category = category.delete();
            category = category.toJSON();

            return this._modelToEntity(category);
        } catch (e) {
            return new Error("No category with id.");
        }
    }

    async getById() {
        try {
            let category = await this._Model.get(id);
            category = category.toJSON();

            return this._modelToEntity(category);
        } catch (e) {
            return new Error("No category with id.");
        }
    }

    async getAll() {
        try {
            let categorys = await new this._Query(this._Model).run();
            categorys = categorys.map(c => c.toJSON());

            return categorys.map(c => this._modelToEntity(c));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbCategoryStoreAdapter;
