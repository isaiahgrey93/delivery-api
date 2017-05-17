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

        this._Model.ensureIndex("categoryId");
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let preset = new this._Model(data);

        preset = await resolve(preset.save());

        if (preset.error) {
            return {
                error: preset.error
            };
        }

        preset = preset.result;

        return {
            result: this._modelToEntity(preset)
        };
    }

    async update(data) {
        let preset = new this._Model(data);

        preset = await resolve(this._Model.get(data.id));

        if (preset.error) {
            return {
                error: new Error("No preset with id.")
            };
        }

        preset = preset.result;

        preset = await resolve(preset.merge(data));

        if (preset.error) {
            return {
                error: preset.error
            };
        }

        preset = preset.result;

        preset = await resolve(
            this._Model.save(preset, { conflict: "update" })
        );

        if (preset.error) {
            return {
                error: preset.error
            };
        }

        preset = preset.result;

        return {
            result: this._modelToEntity(preset)
        };
    }

    async delete(id) {
        let preset = await resolve(this._Model.get(id));

        if (preset.error) {
            return {
                error: new Error("No preset with id.")
            };
        }

        preset = preset.result;

        preset = await resolve(preset.delete());

        if (preset.error) {
            return {
                error: preset.error
            };
        }

        preset = preset.result;

        return {
            result: this._modelToEntity(preset)
        };
    }

    async getById(id) {
        let preset = await resolve(this._Model.get(id));

        if (preset.error) {
            return {
                error: new Error("No preset with id.")
            };
        }

        preset = preset.result;

        return {
            result: this._modelToEntity(preset)
        };
    }

    async getAll() {
        let presets = await resolve(new this._Query(this._Model).run());

        if (presets.error) {
            return {
                error: presets.error
            };
        }

        presets = presets.result;

        return {
            result: presets.map(p => this._modelToEntity(p))
        };
    }

    async filterBy(query) {
        let presets = await resolve(new this._Query(this._Model).filter(query));

        if (presets.error) {
            return {
                error: presets.error
            };
        }

        presets = presets.result;

        return {
            result: presets.map(p => this._modelToEntity(p))
        };
    }
}

module.exports = RethinkDbPresetStoreAdapter;
