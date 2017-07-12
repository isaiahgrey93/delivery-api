const Joi = require("joi");

module.exports = {
    path: "/api/users/filter",
    method: "POST",
    config: {
        validate: {
            query: {
                populate: Joi.string(),
                geometry: Joi.array(),
                distance: Joi.number().positive()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let query = this.helpers.toServerEntity.User(request.payload);

            let { populate = "", geometry, distance } = request.query;
            let relations = populate.split(",");

            let users = await this.libs.users.filterBy(
                query,
                {
                    populate: relations
                },
                {
                    distance,
                    coordinates: geometry
                }
            );

            if (users.error) {
                return reply(users.error);
            }

            users = users.result;

            users = users.map(u => this.helpers.toClientEntity.User(u));

            reply(users);
        }
    }
};
