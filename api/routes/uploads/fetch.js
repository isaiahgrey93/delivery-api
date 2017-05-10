const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            const path = request.params.path;
            const file = await this.libs.uploads.getByPath(path);

            if (!request.headers.authorization) {
                reply.redirect(file);
            } else {
                reply(file);
            }
        }
    }
};
