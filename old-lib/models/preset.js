"use strict";

module.exports = function() {
    const Thinky = this.thinky;
    const Models = this.models;
    const ReQL = Thinky.r;
    const Type = Thinky.type;

    return {
        tableName: "Preset",
        schema: {
            id: Type.string().required().default(() => ReQL.uuid()),
            name: Type.string(),
            width: Type.string(),
            height: Type.string(),
            length: Type.string(),
            weight: Type.string(),
            category_id: Type.string(),
            created_at: Type.date().default(() => ReQL.now()),
            image: Type.string()
        },
        init: model => {
            Models.Category.hasMany(
                Models.Preset,
                "presets",
                "id",
                "category_id"
            );

            model.defineStatic("withoutFields", function(fields) {
                if (!fields) return this;
                else return this.without(fields);
            });
        }
    };
};
