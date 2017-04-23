const Joi = require("joi");

module.exports = {
    path: "/api/recordings",
    method: "POST",
    config: {
        validate: {
            payload: {
                url: Joi.string().required(),
                duration: Joi.number().required(),
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let recording = new this.db.models.Recording(request.payload);

            this.utils.model.validate(recording);

            this.core
                .model("Recording")
                .create(recording)
                .then(recording => reply(recording))
                .catch(err => reply(err));
        }
    }
};
