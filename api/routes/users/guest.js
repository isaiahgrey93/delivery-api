const Joi = require("joi");

module.exports = {
    path: "/api/users/guest",
    method: "POST",
    config: {
        tags: ["api"],
        auth: {
            mode: "optional"
        },
        validate: {},
        handler: async function(request, reply) {
            let user = await resolve(this.libs.users.createGuest());

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            let token = this.utils.user.grantJSONWebToken(user);

            user = this.helpers.toClientEntity.User(user);
            user.token = token;

            reply(user).header("Authorization", token);
        }
    }
};
