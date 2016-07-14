'use strict';

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'Recording',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      drive_id: Type.string(),
      url: Type.string(),
      duration: Type.number(),
      created_at: Type.date().default(() => ReQL.now()),
      updated_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {

    }
  };
};