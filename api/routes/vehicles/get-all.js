const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles",
    method: "GET",
    config: {
        tags: ["api"],
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        handler: async function(request, reply) {
            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let vehicles = await resolve(
                this.libs.vehicles.getAll({ populate: relations })
            );

            if (vehicles.error) {
                return reply(vehicles.error);
            }

            vehicles = vehicles.result;

            vehicles = vehicles.map(v => toClientEntity(v));

            reply(vehicles);
        }
    }
};
