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

    async update() {
        let supportExtension = new this._Model(data);

        try {
            supportExtension = await this._Model.get(data.id);
            supportExtension = await supportExtension.merge(data);
            supportExtension = await this._Model.save(supportExtension, {
                conflict: "update"
            });

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return e;
        }
    }

    async delete() {
        try {
            let supportExtension = await this._Model.get(id);
            supportExtension = supportExtension.delete();

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return new Error("No supportExtension with id.");
        }
    }

    async getById() {
        try {
            let supportExtension = await this._Model.get(id);

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return new Error("No supportExtension with id.");
        }
    }

    async getAll() {
        try {
            let supportExtensions = await new this._Query(this._Model).run();

            return supportExtensions.map(s => this._modelToEntity(s));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbSupportExtensionStoreAdapter;
