const Joi = require("joi");
const { toClientEntity, toServerEntity } = require("./helpers");

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
            let query = toServerEntity(request.payload);

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let users = await this.libs.users.filterBy(query, {
                populate: relations
            });

            if (users.error) {
                return reply(users.error);
            }

            users = users.result;

            users = users.map(u => toClientEntity(u));

            reply(users);
        }
    }
};
