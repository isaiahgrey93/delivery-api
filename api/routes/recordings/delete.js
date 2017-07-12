const Joi = require("joi");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: "DELETE",
    config: {
        validate: {
            params: {
                recording_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.recording_id;

            let recording = await resolve(this.libs.recordings.delete(id));

            if (recording.error) {
                return reply(recording.error);
            }

            recording = recording.result;

            recording = this.helpers.toClientEntity.Recording(recording);

            reply(recording);
        }
    }
};
