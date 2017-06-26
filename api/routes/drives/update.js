const Joi = require("joi");
const { toClientEntity, toServerEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: ["PUT", "PATCH"],
    config: {
        validate: {
            payload: {
                id: Joi.string().strip(),
                created_at: Joi.date().strip(),
                requester_id: Joi.string(),
                driver_id: Joi.any(),
                truck_id: Joi.string(),
                helpers: Joi.number(),
                customer: Joi.object().keys({
                    phone: Joi.string(),
                    email: Joi.string(),
                    name: Joi.string()
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
                drive_type: Joi.string(),
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
            params: {
                drive_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.drive_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = toServerEntity(data);

            let drive = await resolve(
                this.libs.drives.update(params, {
                    populate: relations
                })
            );

            if (drive.error) {
                return reply(drive.error);
            }

            drive = drive.result;

            drive = toClientEntity(drive);

            reply(drive);
        }
    }
};
