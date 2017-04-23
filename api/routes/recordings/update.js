const Joi = require("joi");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: ["PUT", "PATCH"],
    config: {
        auth: {
            scope: ["admin"]
        },
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            payload: {
                url: Joi.string().required(),
                duration: Joi.number().required(),
                drive_id: Joi.string().required()
            },
            params: {
                recording_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let recording = new this.db.models.Recording(request.payload);
            recording.id = request.params.recording_id;

            this.utils.model.validate(recording);

            this.core
                .model("Recording")
                .update(recording)
                .then(recording => reply(recording))
                .catch(err => reply(err));
        }
    }
};
