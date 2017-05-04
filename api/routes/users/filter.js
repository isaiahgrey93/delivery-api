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
            let relations = request.query.populate;
            let query = toServerEntity(request.payload);

            try {
                let users = await this.libs.users.filterBy(query);

                users = users.map(u => toClientEntity(u));
                return reply(users);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
