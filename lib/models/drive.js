'use strict'

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'Drive',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      price: Type.number().min(0),
      items: [
        {
          name: Type.string(),
          height: Type.number(),
          width: Type.number(),
          depth: Type.number(),
          weight: Type.number(),
          images: [Type.string()]
        }
      ],
      route: Type.object().schema({
        origin: Type.object().schema({
          street: Type.string(),
          city: Type.string(),
          state: Type.string(),
          country: Type.string(),
          postal_code: Type.string()
        }),
        destination: Type.object().schema({
          street: Type.string(),
          city: Type.string(),
          state: Type.string(),
          country: Type.string(),
          postal_code: Type.string()
        }),
      }),
      support: Type.object().schema({
        driver_ext: Type.string(),
        requester_ext: Type.string()
      }),
      requester_id: Type.string(),
      driver_id: Type.string(),
      created_at: Type.date().default(() => ReQL.now()),
      updated_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {
      Models.Drive.hasOne(Models.User, 'driver', 'id', 'driver_id')
      Models.Drive.hasOne(Models.User, 'requester', 'id', 'requester_id')
      Models.Drive.hasMany(Models.Recording, 'support_calls', 'id', 'drive_id')
    }
  };
};
