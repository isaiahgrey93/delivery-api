const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: ["PUT", "PATCH"],
    config: {
        validate: {
            payload: {
                id: Joi.string().strip(),
                created_at: Joi.date().strip(),
                requester_id: Joi.string(),
                driver_id: Joi.string(),
                customer: Joi.object().keys({
                    phone: Joi.string(),
                    email: Joi.string()
                }),
                status: Joi.string().valid(
                    "unpaid",
                    "available",
                    "accepted",
                    "loading",
                    "driving",
                    "delivered",
                    "refunded"
                ),
                start_time: Joi.date(),
                end_time: Joi.date(),
                price: Joi.number().positive(),
                payment: Joi.object().keys({
                    charge_id: Joi.string(),
                    transfer_ids: Joi.array().items(Joi.string())
                }),
                drive_progress_confirmation: Joi.object().keys({
                    pickup_arrival: Joi.string(),
                    pickup_loaded: Joi.string(),
                    dropoff: Joi.string()
                }),
                route: Joi.object().keys({
                    distance: Joi.number(),
                    origin: Joi.object().keys({
                        name: Joi.string(),
                        street: Joi.string(),
                        city: Joi.string(),
                        state: Joi.string(),
                        zip: Joi.string(),
                        geo: Joi.object().strip()
                    }),
                    destination: Joi.object().keys({
                        name: Joi.string(),
                        street: Joi.string(),
                        city: Joi.string(),
                        state: Joi.string(),
                        zip: Joi.string(),
                        geo: Joi.object().strip()
                    })
                }),
                items: Joi.array().items(
                    Joi.object().keys({
                        name: Joi.string(),
                        quantity: Joi.number(),
                        height: Joi.number(),
                        width: Joi.number(),
                        length: Joi.number(),
                        weight: Joi.number(),
                        value: Joi.number(),
                        notes: Joi.any(),
                        images: Joi.array().items(Joi.string())
                    })
                ),
                support: Joi.object().keys({
                    driver_ext: Joi.string(),
                    requester_ext: Joi.string(),
                    customer_ext: Joi.string()
                }),
                support_calls: Joi.array()
            },
            params: {
                drive_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let payload = request.payload;
            let relations = request.query.populate;
            payload.id = request.params.drive_id;

            this.core
                .model("Drive")
                .findById(payload.id, {})
                .then(drive =>
                    this.core.drive.getGeoPoints(Object.assign(drive, payload))
                )
                .then(drive => {
                    drive = new this.db.models.Drive(drive);

                    this.utils.model.validate(drive);

                    this.core
                        .model("Drive")
                        .update(drive)
                        .then(drive => {
                            return this.core.model("Drive").findById(drive.id, {
                                populate: this.utils.model.populate(relations)
                            });
                        })
                        .then(drive => reply(drive));
                })
                .catch(err => reply(err));
        }
    }
};