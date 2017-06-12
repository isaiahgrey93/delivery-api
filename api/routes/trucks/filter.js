const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/trucks/filter",
    method: "POST",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let query = toServerEntity(request.payload);

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let trucks = await this.libs.trucks.filterBy(query, {
                populate: relations
            });

            if (trucks.error) {
                return reply(trucks.error);
            }

            trucks = trucks.result;

            trucks = trucks.map(t => toClientEntity(t));

            reply(trucks);
        }
    }
};
