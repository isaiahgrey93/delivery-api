const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            const path = request.params.path;
            const auth = request.headers.authorization;

            const file = this.libs.uploads.getByPath(path);

            if (!auth) {
                reply.redirect(file);
            } else {
                reply(file);
            }
        }
    }
};
