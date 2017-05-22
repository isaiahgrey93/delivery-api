const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/trucks/{truck_id}",
    method: "DELETE",
    config: {
        validate: {
            params: {
                truck_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.truck_id;

            let truck = await this.libs.trucks.delete(id);

            if (truck.error) {
                return reply(truck.error);
            }

            truck = truck.result;

            truck = toClientEntity(truck);

            reply(truck);
        }
    }
};
