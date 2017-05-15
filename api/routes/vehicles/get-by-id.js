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

            try {
                let vehicle = await this.libs.vehicles.getById(id);

                vehicle = toClientEntity(vehicle);

                reply(vehicle);
            } catch (e) {
                reply(e);
            }
        }
    }
};
