const Joi = require("joi");
const uuid = require("uuid");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "POST",
    config: {
        tags: ["api"],
        handler: function(request, reply) {
            let file = request.payload.file;
            let id = request.params.path;

            if (typeof file === "string") return reply({ key: file });

            this.core.upload
                .create(id || uuid.v1(), file)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
