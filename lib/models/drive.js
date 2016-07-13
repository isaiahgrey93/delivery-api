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
      items: [{
        name: Type.string(),
        height: Type.string(),
        width: Type.string(),
        depth: Type.string(),
        weight: Type.string(),
        images: [Type.string()]
      }],
      route: Type.object().schema({
        origin: Type.point(),
        destination: Type.point(),
      }),
      requester_id: Type.string(),
      driver_id: Type.string(),
      created_at: Type.date().default(() => ReQL.now()),
      updated_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {
      Models.Drive.hasOne(Models.User, 'driver', 'id', 'driver_id')
      Models.Drive.hasOne(Models.User, 'requester', 'id', 'user_id')

    }
  };
};
