const Joi = require("joi");

module.exports = {
    path: "/api/users/{user_id}",
    method: "DELETE",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.user_id;

            try {
                let user = await this.libs.users.delete(id);

                reply(user);
            } catch (e) {
                reply(e);
            }
        }
    }
};
