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

            try {
                let users = await this.libs.users.getByRole(role, {
                    populate: relations
                });

                users = users.map(u => toClientEntity(u));

                reply(users);
            } catch (e) {
                reply(e);
            }
        }
    }
};
