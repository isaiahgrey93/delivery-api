const Joi = require("joi");

module.exports = {
    path: "/api/uploads/{path*}",
    method: "DELETE",
    config: {
        tags: ["api"],
        handler: function(request, reply) {
            let path = request.params.path;

            this.core.upload
                .remove(path)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
