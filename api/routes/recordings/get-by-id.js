const Joi = require("joi");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: "GET",
    config: {
        auth: {
            scope: ["admin"]
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
                .findById(id)
                .then(recording => reply(recording))
                .catch(err => reply(err));
        }
    }
};
