const Joi = require("joi");
const { toClientEntity } = require("../../helpers");

module.exports = {
    path: "/api/accounts/{user_id}",
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

            let user = await resolve(this.libs.payments.createAccount(userId));

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            user = toClientEntity(user);

            reply(user);
        }
    }
};
