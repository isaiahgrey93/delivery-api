const Joi = require("joi");

module.exports = {
    path: "/api/customers/{user_id}",
    method: ["PUT", "PATCH"],
    config: {
        validate: {
            payload: true,
            params: {
                user_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let userId = request.params.user_id;
            let data = request.payload;

            let user = await resolve(
                this.libs.payments.updateCustomer(userId, data)
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            reply(user);
        }
    }
};
