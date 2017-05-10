const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "DELETE",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let path = request.params.path;

            try {
                let upload = this.libs.uploads.delete(path);

                reply(upload);
            } catch (e) {
                reply(e);
            }
        }
    }
};
