const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

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
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            let recording = await resolve(this.libs.recordings.create(params));

            if (recording.error) {
                return reply(recording.error);
            }

            recording = recording.result;

            recording = toClientEntity(recording);

            reply(recording);
        }
    }
};
