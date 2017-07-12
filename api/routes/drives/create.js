const Joi = require("joi");

module.exports = {
    path: "/api/drives",
    method: "POST",
    config: {
        validate: {
            payload: {
                id: Joi.string().strip(),
                created_at: Joi.date().strip(),
                updated_at: Joi.date().strip(),
                requester_id: Joi.string(),
                driver_id: Joi.any(),
                truck_id: Joi.string(),
                helpers: Joi.number(),
                customer: Joi.object().keys({
                    name: Joi.string(),
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
                route: Joi.object()
                    .keys({
                        distance: Joi.number(),
                        origin: Joi.object()
                            .keys({
                                name: Joi.string(),
                                street: Joi.string().required(),
                                city: Joi.string().required(),
                                state: Joi.string().required(),
                                zip: Joi.string().required(),
                                geo: Joi.object().strip()
                            })
                            .required(),
                        destination: Joi.object()
                            .keys({
                                name: Joi.string(),
                                street: Joi.string().required(),
                                city: Joi.string().required(),
                                state: Joi.string().required(),
                                zip: Joi.string().required(),
                                geo: Joi.object().strip()
                            })
                            .required()
                    })
                    .required(),
                drive_type: Joi.string().required(),
                commercial_cargo_items: Joi.array().items(
                    Joi.object().keys({
                        name: Joi.string(),
                        quantity: Joi.number(),
                        height: Joi.number(),
                        width: Joi.number(),
                        length: Joi.number(),
                        weight: Joi.number(),
                        value: Joi.number(),
                        notes: Joi.any(),
                        categoryId: Joi.strip(),
                        images: Joi.array().items(Joi.string())
                    })
                ),
                consumer_cargo: Joi.object().keys({
                    value: Joi.number(),
                    weight: Joi.number(),
                    description: Joi.string(),
                    images: Joi.array(Joi.string())
                }),
                support: Joi.object().keys({
                    driver_ext: Joi.string(),
                    requester_ext: Joi.string(),
                    customer_ext: Joi.string()
                }),
                support_calls: Joi.array()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;
            let auth = request.auth.credentials;

            data.requester_id = data.requester_id || auth.id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = this.helpers.toServerEntity.Drive(data);

            let drive = await resolve(
                this.libs.drives.create(params, {
                    populate: relations
                })
            );

            if (drive.error) {
                return reply(drive.error);
            }

            drive = drive.result;

            drive = this.helpers.toClientEntity.Drive(drive);

            reply(drive);
        }
    }
};
