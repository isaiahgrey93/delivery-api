const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users",
    method: "GET",
    config: {
        auth: false,
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

            users = users.map(u => toClientEntity(u));

            reply(users);
        }
    }
};
