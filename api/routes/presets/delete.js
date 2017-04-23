const Joi = require("joi");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: "DELETE",
    config: {
        auth: {
            scope: ["requester", "admin"]
        },
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
                .remove(id)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
