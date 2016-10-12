'use strict'

module.exports = function () {
    const Thinky = this.thinky;
    const Models = this.models;
    const ReQL = Thinky.r;
    const Type = Thinky.type;

    return {
        tableName: 'Category',
        schema: {
            id: Type.string().required().default(() => ReQL.uuid()),
            name: Type.string(),
            image: Type.string(),
            user_id: Type.string(),
            created_at: Type.date().default(() => ReQL.now()),
        },
        init: (model) => {
            Models.User.hasMany(Models.Category, 'categories', 'id', 'user_id');

            model.defineStatic('withoutFields', function(fields) {
                if (!fields) return this;
                else return this.without(fields);
            });
        }
    };
};
