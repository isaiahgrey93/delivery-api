const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: ["DELETE"],
    config: {
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.vehicle_id;

            let vehicle = await resolve(this.libs.vehicles.delete(id));

            if (vehicle.error) {
                return reply(vehicle.error);
            }

            vehicle = vehicle.result;

            vehicle = toClientEntity(vehicle);

            reply(vehicle);
        }
    }
};
