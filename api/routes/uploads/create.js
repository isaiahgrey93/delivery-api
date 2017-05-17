const Joi = require("joi");
const uuid = require("uuid");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "POST",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let file = request.payload.file;
            let path = request.params.path;

            if (typeof file === "string") return reply({ key: file });

            let upload = await resolve(
                this.libs.uploads.create(path || uuid.v1(), file)
            );

            if (upload.error) {
                return reply(upload.error);
            }

            upload = upload.result;

            reply(upload);
        }
    }
};
