const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/trucks/{truck_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                truck_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.truck_id;

            let truck = await resolve(this.libs.trucks.getById(id));

            if (truck.error) {
                return reply(truck.error);
            }

            truck = trucks.result;

            truck = toClientEntity(truck);

            reply(truck);
        }
    }
};
