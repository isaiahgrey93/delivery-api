const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        handler: async function(request, reply) {
            let id = request.params.vehicle_id;

            let vehicle = await resolve(this.libs.vehicles.getById(id));

            if (vehicle.error) {
                return reply(vehicle.error);
            }

            vehicle = vehicle.result;

            vehicle = toClientEntity(vehicle);

            reply(vehicle);
        }
    }
};
