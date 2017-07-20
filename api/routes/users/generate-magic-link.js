const Joi = require("joi");

module.exports = {
    path: "/api/users/magic",
    method: "POST",
    config: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string().optional(),
                phone: Joi.string().optional(),
                url: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;

            let response = await resolve(
                this.libs.users.generateMagicLink(data)
            );

            if (response.error) {
                return reply(response.error);
            }

            response = response.result;

            reply(response);
        }
    }
};
