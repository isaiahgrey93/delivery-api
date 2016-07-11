'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: "Preset",
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      name: Type.string().required(),
      width: Type.string().required(),
      height: Type.string().required(),
      depth: Type.string().required(),
      weight: Type.string().required(),
      userId: Type.string().required(),
      created_at: Type.date().required().default(() => ReQL.now()),
      updated_at: Type.date().required().default(() => ReQL.now())
    },
    init: (model) => {
       Models.User.hasMany(Models.Preset, 'presets', 'id', "userId")

    }
  };
};
