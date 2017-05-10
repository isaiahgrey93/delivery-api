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

            try {
                let upload = await this.libs.uploads.create(
                    path || uuid.v1(),
                    file
                );

                reply(upload);
            } catch (e) {
                reply(e);
            }
        }
    }
};
