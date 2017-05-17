const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/recordings/{recording_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                recording_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.recording_id;

            let recording = await resolve(this.libs.recordings.getById(id));

            if (recording.error) {
                return reply(recording.error);
            }

            recording = recording.result;

            recording = toClientEntity(recording);

            reply(recording);
        }
    }
};
