const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "GET",
    config: {
        tags: ["api"],
        handler: function(request, reply) {
            const path = request.params.path;
            const file = this.core.upload.fetch(path);

            if (!request.headers.authorization) {
                reply.redirect(file);
            } else {
                reply(file);
            }
        }
    }
};
