const { SupportExtension } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbSupportExtensionStoreAdapter {
    constructor(thinky) {
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = SupportExtension;
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

        this._Model.define("toJSON", function() {
            return omit(this, []);
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let supportExtension = new this._Entity(data);
        try {
            supportExtension = await supportExtension.save();
            supportExtension = supportExtension.toJSON();

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
            supportExtension = supportExtension.toJSON();

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return e;
        }
    }

    async delete() {
        try {
            let supportExtension = await this._Model.get(id);
            supportExtension = supportExtension.delete();
            supportExtension = supportExtension.toJSON();

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return new Error("No supportExtension with id.");
        }
    }

    async getById() {
        try {
            let supportExtension = await this._Model.get(id);
            supportExtension = supportExtension.toJSON();

            return this._modelToEntity(supportExtension);
        } catch (e) {
            return new Error("No supportExtension with id.");
        }
    }

    async getAll() {
        try {
            let supportExtensions = await new this._Query(this._Model).run();
            supportExtensions = supportExtensions.map(s => s.toJSON());

            return supportExtensions.map(s => this._modelToEntity(s));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbSupportExtensionStoreAdapter;
