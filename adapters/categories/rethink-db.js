const { Category } = require("../../common-entities");
const CategoryStorePort = require("./store-port");
const { omit } = require("lodash");

class RethinkDbCategoryStoreAdapter extends CategoryStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Category;
        this._Model = thinky.createModel(
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

        this._Model.ensureIndex("userId");
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let category = new this._Model(data);

        category = await resolve(category.save());

        if (category.error) {
            return {
                error: category.error
            };
        }

        category = category.result;

        return {
            result: this._modelToEntity(category)
        };
    }

    async update(data) {
        let category = new this._Model(data);

        category = await resolve(this._Model.get(data.id));

        if (category.error) {
            return {
                error: new Error("No category with id.")
            };
        }

        category = category.result;

        category = await resolve(category.merge(data));

        if (category.error) {
            return {
                error: category.error
            };
        }

        category = category.result;

        category = await resolve(
            this._Model.save(category, { conflict: "update" })
        );

        if (category.error) {
            return {
                error: category.error
            };
        }

        category = category.result;

        return {
            result: this._modelToEntity(category)
        };
    }

    async delete(id) {
        let category = await resolve(this._Model.get(id));

        if (category.error) {
            return {
                error: new Error("No category with id.")
            };
        }

        category = await resolve(category.delete());

        if (category.error) {
            return {
                error: category.error
            };
        }

        return {
            result: this._modelToEntity(category)
        };
    }

    async getById(id) {
        let category = await resolve(this._Model.get(id));

        if (category.error) {
            return {
                error: new Error("No category with id.")
            };
        }

        return {
            result: this._modelToEntity(category)
        };
    }

    async getAll() {
        let categories = await resolve(new this._Query(this._Model).run());

        if (categories.error) {
            return {
                error: categories.error
            };
        }

        categories = categories.result;

        return {
            result: categories.map(c => this._modelToEntity(c))
        };
    }

    async filterBy(query) {
        let categories = await resolve(
            new this._Query(this._Model).filter(query)
        );

        if (categories.error) {
            return {
                error: categories.error
            };
        }

        categories = categories.result;

        return {
            result: categories.map(c => this._modelToEntity(c))
        };
    }
}

module.exports = RethinkDbCategoryStoreAdapter;
