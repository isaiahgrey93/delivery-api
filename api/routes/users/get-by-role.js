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
            let relations = request.query.populate;

            try {
                let users = await this.libs.users.getByRole(role);
                users = users.map(u => toClientEntity(u));

                return reply(users);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
