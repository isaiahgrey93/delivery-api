const Joi = require("joi");
const { toClientEntity } = require("./helpers");

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

            let user = await resolve(this.libs.users.delete(id));

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            user = toClientEntity(user);

            reply(user);
        }
    }
};
