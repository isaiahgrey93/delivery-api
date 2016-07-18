'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'Preset',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      name: Type.string(),
      width: Type.string(),
      height: Type.string(),
      depth: Type.string(),
      weight: Type.string(),
      user_id: Type.string(),
      created_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {
       Models.User.hasMany(Models.Preset, 'presets', 'id', 'user_id');
      
      model.defineStatic('withoutFields', function(fields) {
        if (!fields) return this;
        else return this.without(fields);
      });
    }
  };
};
