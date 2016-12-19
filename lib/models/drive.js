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
            customer: Type.object().schema({
                phone: Type.string(),
                email: Type.string(),
            }),
            payment: Type.object().schema({
                charge_id: Type.string(),
                transfer_ids: Type.array(Type.string())
            }),
            price: Type.number().min(0),
            status: Type.string().enum(drive_statuses).default(() => 'new'),
            start_time: Type.date(),
            end_time: Type.date(),
            drive_progress_confirmation: Type.object().schema({
                pickup_arrival: Type.string(),
                pickup_loaded: Type.string(),
                dropoff: Type.string()
            }),
            items: [
                {
                    name: Type.string(),
                    quantity: Type.number(),
                    height: Type.number(),
                    width: Type.number(),
                    length: Type.number(),
                    weight: Type.number(),
                    value: Type.number(),
                    notes: Type.string().optional(),
                    images: [Type.string()]
                }
            ],
            route: Type.object().schema({
                origin: Type.object().schema({
                    name: Type.string(),
                    street: Type.string(),
                    city: Type.string(),
                    state: Type.string(),
                    zip: Type.string(),
                    geo: Type.object()
                }),
                destination: Type.object().schema({
                    name: Type.string(),
                    street: Type.string(),
                    city: Type.string(),
                    state: Type.string(),
                    zip: Type.string(),
                    geo: Type.object()
                }),
            }),
            support: Type.object().schema({
                driver_ext: Type.string(),
                requester_ext: Type.string(),
                customer_ext: Type.string(),
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
                return Core.support.extensions.getAvailableExtensions(3)
                .then((extensions) => this.support = {
                    driver_ext: extensions[0].ext.toString(),
                    requester_ext: extensions[1].ext.toString(),
                    customer_ext: extensions[2].ext.toString(),
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
