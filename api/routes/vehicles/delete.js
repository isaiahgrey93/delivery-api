const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: ["DELETE"],
    config: {
        auth: {
            scope: ["driver", "admin"]
        },
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.vehicle_id;

            try {
                let vehicle = await this.libs.vehicles.delete(id);

                vehicle = toClientEntity(vehicle);
                reply(vehicle);
            } catch (e) {
                reply(e);
            }
        }
    }
};
