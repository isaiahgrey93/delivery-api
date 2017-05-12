const PresetStorePort = require("./store-port");
const { Preset } = require("../../common-entities");
const { omit } = require("lodash");

class RethinkDbPresetStoreAdapter extends PresetStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._Query = Query;
        this._Entity = Preset;
        this._Model = thinky.createModel(
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

        this._Model.define("toJSON", function() {
            return omit(this, []);
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let preset = new this._Model(data);
        try {
            preset = await preset.save();
            preset = preset.toJSON();

            return this._modelToEntity(preset);
        } catch (e) {
            return e;
        }
    }

    async update(data) {
        let preset = new this._Model(data);

        try {
            preset = await this._Model.get(data.id);
            preset = await preset.merge(data);
            preset = await this._Model.save(preset, { conflict: "update" });
            preset = preset.toJSON();

            return this._modelToEntity(preset);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let preset = await this._Model.get(id);
            preset = preset.delete();
            preset = preset.toJSON();

            return this._modelToEntity(preset);
        } catch (e) {
            return new Error("No preset with id.");
        }
    }

    async getById(id) {
        try {
            let preset = await this._Model.get(id);
            preset = preset.toJSON();

            return this._modelToEntity(preset);
        } catch (e) {
            return new Error("No preset with id.");
        }
    }

    async getAll() {
        try {
            let presets = await new this._Query(this._Model).run();
            presets = presets.map(p => p.toJSON());

            return presets.map(p => this._modelToEntity(p));
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbPresetStoreAdapter;
