const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            const path = request.params.path;
            const auth = request.auth;

            const file = await this.libs.uploads.getByPath(path);

            if (auth) {
                return reply.redirect(file);
            }

            reply(file);
        }
    }
};
