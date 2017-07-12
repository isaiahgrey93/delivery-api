const Joi = require("joi");

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
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.vehicle_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = this.helpers.toServerEntity.Vehicle(data);

            let vehicle = await resolve(
                this.libs.vehicles.update(params, { populate: relations })
            );

            if (vehicle.error) {
                return reply(vehicle.error);
            }

            vehicle = vehicle.result;

            vehicle = this.helpers.toClientEntity.Vehicle(vehicle);

            reply(vehicle);
        }
    }
};
