const Joi = require("joi");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: ["DELETE"],
    config: {
        auth: {
            scope: ["driver", "admin"]
        },
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.vehicle_id;

            this.core
                .model("Vehicle")
                .remove(id)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
