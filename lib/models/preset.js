'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const ReQL = Thinky.r;
  const Type = Thinky.type;
  const Models = this.models;

  return {
    tableName: "Preset",
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      width: Type.string().required(),
      height: Type.string().required(),
      depth: Type.string().required(),
      weight: Type.string().required(),
      userId: Type.string(),
      created_at: Type.date().required().default(() => ReQL.now()),
      updated_at: Type.date().required().default(() => ReQL.now())
    },
    init: (model) => {
       Models.User.hasMany(Models.Preset, 'presets', 'id', "userId")

    }
  };
};
