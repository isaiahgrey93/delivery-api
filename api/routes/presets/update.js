const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        auth: {
            scope: ["requester", "admin"]
        },
        validate: {
            payload: {
                name: Joi.string(),
                width: Joi.string(),
                height: Joi.string(),
                length: Joi.string(),
                weight: Joi.string(),
                image: Joi.any(),
                category_id: Joi.string().required()
            },
            params: {
                preset_id: Joi.string().required()
            }
        },
        pre: [
            {
                assign: "image",
                method: Prehandlers.upload("image")
            }
        ],
        handler: function(request, reply) {
            let preset = new this.db.models.Preset(request.payload);
            preset.id = request.params.preset_id;

            this.utils.model.validate(preset);

            this.core
                .model("Preset")
                .update(preset)
                .then(preset => reply(preset))
                .catch(err => reply(err));
        }
    }
};
