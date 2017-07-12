const Joi = require("joi");

module.exports = {
    path: "/api/trucks",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let trucks = await resolve(this.libs.trucks.getAll());

            if (trucks.error) {
                return reply(trucks.error);
            }

            trucks = trucks.results;

            trucks = trucks.map(t => this.helpers.toClientEntity.Truck(t));

            reply(trucks);
        }
    }
};
