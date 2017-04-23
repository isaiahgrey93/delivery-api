const Joi = require("joi");

module.exports = {
    path: "/api/presets",
    method: "GET",
    config: {
        tags: ["api"],
        handler: function(request, reply) {
            this.core
                .model("Preset")
                .getAll()
                .then(preset => reply(preset))
                .catch(err => reply(err));
        }
    }
};
