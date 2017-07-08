const Joi = require("joi");

module.exports = {
    path: "/api/customers/{user_id}/source",
    method: "POST",
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

            let source = await resolve(
                this.libs.payments.addCustomerSource(userId, data)
            );

            if (source.error) {
                return reply(source.error);
            }

            source = source.result;

            reply(source);
        }
    }
};
