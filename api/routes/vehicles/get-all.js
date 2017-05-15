const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            try {
                let vehicles = await this.libs.vehicles.getAll();

                vehicles = vehicles.map(v => toClientEntity(v));

                reply(vehicles);
            } catch (e) {
                reply(e);
            }
        }
    }
};
