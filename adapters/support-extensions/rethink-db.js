const SupportExtensionStorePort = require("./store-port");
const { SupportExtension } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbSupportExtensionStoreAdapter extends SupportExtensionStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = SupportExtension;
        this._Model = thinky.createModel(
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
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let supportExtension = new this._Entity(data);
        try {
            supportExtension = await supportExtension.save();

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return e;
        }
    }

    async create(data) {
        let supportExtension = new this._Model(data);

        supportExtension = await resolve(supportExtension.save());

        if (supportExtension.error) {
            return {
                error: supportExtension.error
            };
        }

        supportExtension = supportExtension.result;

        return {
            result: this._modelToEntity(supportExtension)
        };
    }

    async update(data) {
        let supportExtension = new this._Model(data);

        supportExtension = await resolve(this._Model.get(data.id));

        if (supportExtension.error) {
            return {
                error: new Error("No support extension with id.")
            };
        }

        supportExtension = supportExtension.result;

        supportExtension = await resolve(supportExtension.merge(data));

        if (supportExtension.error) {
            return {
                error: supportExtension.error
            };
        }

        supportExtension = supportExtension.result;

        supportExtension = await resolve(
            this._Model.save(supportExtension, { conflict: "update" })
        );

        if (supportExtension.error) {
            return {
                error: supportExtension.error
            };
        }

        supportExtension = supportExtension.result;

        return {
            result: this._modelToEntity(supportExtension)
        };
    }

    async delete(id) {
        let supportExtension = await resolve(this._Model.get(id));

        if (supportExtension.error) {
            return {
                error: new Error("No support extension with id.")
            };
        }

        supportExtension = supportExtension.result;

        supportExtension = await resolve(supportExtension.delete());

        if (supportExtension.error) {
            return {
                error: supportExtension.error
            };
        }

        supportExtension = supportExtension.result;

        return {
            result: this._modelToEntity(supportExtension)
        };
    }

    async getById(id) {
        let supportExtension = await resolve(this._Model.get(id));

        if (supportExtension.error) {
            return {
                error: new Error("No support extension with id.")
            };
        }

        supportExtension = supportExtension.result;

        return {
            result: this._modelToEntity(supportExtension)
        };
    }

    async getAll() {
        let supportExtensions = await resolve(
            new this._Query(this._Model).run()
        );

        if (supportExtensions.error) {
            return {
                error: supportExtensions.error
            };
        }

        supportExtensions = supportExtensions.result;

        return {
            result: supportExtensions.map(s => this._modelToEntity(s))
        };
    }

    async filterBy(query) {
        let supportExtensions = await resolve(
            new this._Query(this._Model).filter(query)
        );

        if (supportExtensions.error) {
            return {
                error: supportExtensions.error
            };
        }

        supportExtensions = supportExtensions.result;

        return {
            result: supportExtensions.map(s => this._modelToEntity(s))
        };
    }
}

module.exports = RethinkDbSupportExtensionStoreAdapter;
