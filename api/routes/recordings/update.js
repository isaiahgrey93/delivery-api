const Joi = require("joi");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: ["PUT", "PATCH"],
    config: {
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
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.recording_id;

            let params = this.helpers.toServerEntity.Recording(data);

            let recording = await resolve(this.libs.recordings.update(params));

            if (recording.error) {
                return reply(recording.error);
            }

            recording = recording.result;

            recording = this.helpers.toClientEntity.Recording(recording);

            reply(recording);
        }
    }
};
