const Joi = require("joi");

module.exports = {
    path: "/api/recordings",
    method: "GET",
    config: {
        auth: {
            scope: ["admin"]
        },
        tags: ["api"],
        handler: function(request, reply) {
            this.core
                .model("Recording")
                .getAll()
                .then(recording => reply(recording))
                .catch(err => reply(err));
        }
    }
};
