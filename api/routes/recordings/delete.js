const Joi = require("joi");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: "DELETE",
    config: {
        auth: {
            scope: ["admin"]
        },
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                recording_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.recording_id;

            this.core
                .model("Recording")
                .remove(id)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
