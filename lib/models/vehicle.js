"use strict";

module.exports = function() {
    const Thinky = this.thinky;
    const Models = this.models;
    const ReQL = Thinky.r;
    const Type = Thinky.type;

    return {
        tableName: "Vehicle",
        schema: {
            id: Type.string().default(() => ReQL.uuid()),
            nickname: Type.string(),
            make: Type.string(),
            model: Type.string(),
            year: Type.string(),
            license_plate: Type.object().schema({
                number: Type.string(),
                state: Type.string()
            }),
            user_id: Type.string(),
            insurance: Type.string(),
            registration: Type.string(),
            images: [Type.string()],
            created_at: Type.date().default(() => ReQL.now())
        },
        init: model => {
            Models.User.hasOne(Models.Vehicle, "vehicle", "id", "user_id");

            model.defineStatic("withoutFields", function(fields) {
                if (!fields) return this;
                else return this.without(fields);
            });
        }
    };
};
