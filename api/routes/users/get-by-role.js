const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users/{user_role}s/role",
    method: "GET",
    config: {
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let role = request.params.user_role;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let users = await resolve(
                this.libs.users.getByRole(role, {
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
