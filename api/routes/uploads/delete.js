const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "DELETE",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let path = request.params.path;

            let upload = await resolve(this.libs.uploads.delete(path));

            if (upload.error) {
                return reply(upload.error);
            }

            upload = upload.result;

            reply(upload);
        }
    }
};
