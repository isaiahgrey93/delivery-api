const Joi = require("joi");

module.exports = {
    path: "/api/users/{user_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.user_id;
            let relations = request.query.populate;

            try {
                let user = await this.libs.users.getById(id);

                return reply(user);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
