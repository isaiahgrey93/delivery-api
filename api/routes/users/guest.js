const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

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

            user = toClientEntity(user);
            user.token = token;

            reply(user).header("Authorization", token);
        }
    }
};
