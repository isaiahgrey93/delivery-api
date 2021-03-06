const Joi = require("joi");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        handler: async function(request, reply) {
            let id = request.params.vehicle_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let vehicle = await resolve(
                this.libs.vehicles.getById(id, { populate: relations })
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
