const Joi = require("joi");

module.exports = {
    path: "/api/users",
    method: "GET",
    config: {
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let users = await resolve(
                this.libs.users.getAll({
                    populate: relations
                })
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
