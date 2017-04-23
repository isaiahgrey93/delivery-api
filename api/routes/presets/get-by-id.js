const Joi = require("joi");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                preset_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.preset_id;

            this.core
                .model("Preset")
                .findById(id)
                .then(preset => reply(preset))
                .catch(err => reply(err));
        }
    }
};
