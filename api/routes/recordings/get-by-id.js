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

            try {
                let recording = await this.libs.recordings.getById(id);

                recording = toClientEntity(recording);

                reply(recording);
            } catch (e) {
                reply(e);
            }
        }
    }
};
