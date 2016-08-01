'use strict'

const Core = require('.././core')

module.exports = function () {
  const Thinky = this.thinky;
  const Models = this.models;
  const ReQL = Thinky.r;
  const Type = Thinky.type;
  const drive_statuses = ['new', 'available', 'active', 'delivered', 'processed', 'refunded'];

  return {
    tableName: 'Drive',
    schema: {
      id: Type.string().required().default(() => ReQL.uuid()),
      requester_id: Type.string(),
      driver_id: Type.string().default('N/A'),
      payment: Type.object().schema({
        charge_id: Type.string(),
        transfer_ids: Type.array(Type.string())
      }),
      price: Type.number().min(0),
      status: Type.string().enum(drive_statuses).default(() => 'new'),
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
      }).default({}),
      created_at: Type.date().default(() => ReQL.now())
    },
    init: (model) => {
      Models.Drive.hasOne(Models.User, 'driver', 'driver_id', 'id');
      Models.Drive.hasOne(Models.User, 'requester', 'requester_id', 'id');
      Models.Drive.hasMany(Models.Recording, 'support_calls', 'id', 'drive_id');

      model.pre('save', function (next) {
        return this.setExtensions()
          .then(() => next())
          .catch((err) => next(err))
      })

      model.post('retrieve', function(next) {
        if (this.requester) delete this.requester.password;
        if (this.driver) delete this.driver.password;
        next();
      });


      model.define('setExtensions', function () {
        return Core.support.extensions.getAvailableExtensions(2)
          .then((extensions) => this.support = {
            driver_ext: extensions[0].ext.toString(),
            requester_ext: extensions[1].ext.toString()
          })
          .catch((err) => err)
      })

      model.defineStatic('withoutFields', function(fields) {
        if (!fields) return this;
        else return this.without(fields);
      });

      // drive change feed
      model.changes().then((feed) => {
          feed.each((err, drive) => {

            if (err) return err;
            else if (drive.isSaved() === false) return // deleted
            else if (drive.getOldValue() == null) return // created
            else {  // updated
              let prev = drive.getOldValue();

              // Release extensions when a drive is inactive
              if (drive_statuses.indexOf(prev.status) < 3 && drive_statuses.indexOf(drive.status) >= 3) {
                return Core.support.extensions.releaseExtensions(drive)
                  .then((drive) => drive)
                  .catch((err) => err)
              }
          }
        })
      })


    }
  };
};
