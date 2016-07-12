'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'Vehicle',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      make: Type.string().required(),
      model: Type.string().required(),
      year: Type.string().required(),
      class: Type.string().required(),
      license: Type.object().schema({
        number: Type.string().required(),
        image: Type.string().required(),
        expiration: Type.string().required(),
      }),
      user_id: Type.string(),
      created_at: Type.date().required().default(() => ReQL.now()),
      updated_at: Type.date().required().default(() => ReQL.now())
    },
    init: (model) => {
       Models.User.hasOne(Models.Vehicle, 'vehicle', 'id', 'user_id')

    }
  };
};
