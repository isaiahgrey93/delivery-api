'use strict';

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;

  return {
    tableName: 'SupportExtension',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      ext: Type.any().required(),
      active: Type.boolean().required().default(false)
    },
    init: (model) => {

    }
  };
};
