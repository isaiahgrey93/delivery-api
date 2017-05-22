const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: ["PUT", "PATCH"],
    config: {
        validate: {
            payload: {
                nickname: Joi.string(),
                make: Joi.string(),
                model: Joi.string(),
                year: Joi.string(),
                license_plate: Joi.object().keys({
                    number: Joi.string(),
                    state: Joi.string()
                }),
                insurance: Joi.any(),
                registration: Joi.any(),
                images: Joi.array().items(Joi.any()).max(4).single(),
                user_id: Joi.string(),
                truck_id: Joi.string()
            },
            params: {
                vehicle_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        pre: [
            {
                assign: "insurance",
                method: Prehandlers.upload("insurance")
            },
            {
                assign: "registration",
                method: Prehandlers.upload("registration")
            },
            {
                assign: "images[0]",
                method: Prehandlers.upload("images[0]")
            },
            {
                assign: "images[1]",
                method: Prehandlers.upload("images[1]")
            },
            {
                assign: "images[2]",
                method: Prehandlers.upload("images[2]")
            },
            {
                assign: "images[3]",
                method: Prehandlers.upload("images[3]")
            }
        ],
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.vehicle_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = toServerEntity(data);

            let vehicle = await resolve(
                this.libs.vehicles.update(params, { populate: relations })
            );

            if (vehicle.error) {
                return reply(vehicle.error);
            }

            vehicle = vehicle.result;

            vehicle = toClientEntity(vehicle);

            reply(vehicle);
        }
    }
};
