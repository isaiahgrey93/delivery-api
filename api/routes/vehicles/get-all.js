const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let vehicles = await resolve(this.libs.vehicles.getAll());

            if (vehicles.error) {
                return reply(vehicles.error);
            }

            vehicles = vehicles.result;

            vehicles = vehicles.map(v => toClientEntity(v));

            reply(vehicles);
        }
    }
};
