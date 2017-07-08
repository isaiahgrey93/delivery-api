const Joi = require("joi");

module.exports = {
    path: "/api/customers/{user_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let userId = request.params.user_id;

            let user = await resolve(
                this.libs.payments.getCustomerById(userId)
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            reply(user);
        }
    }
};
