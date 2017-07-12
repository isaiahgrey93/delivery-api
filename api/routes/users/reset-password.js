const Joi = require("joi");

module.exports = {
    path: "/api/users/{email}/password",
    method: "POST",
    config: {
        auth: {
            mode: "optional"
        },
        validate: {
            payload: {
                password: Joi.string().min(6).required()
            },
            params: {
                email: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let email = request.params.email;
            let newPassword = request.payload.password;

            let user = await resolve(
                this.libs.users.resetPassword(email, newPassword)
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            user = this.helpers.toClientEntity.User(user);

            reply(user);
        }
    }
};
