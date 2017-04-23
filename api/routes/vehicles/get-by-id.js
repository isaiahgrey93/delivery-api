const Joi = require("joi");

module.exports = {
    path: "/api/vehicles/{vehicle_id}",
    method: "GET",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        handler: function(request, reply) {
            let id = request.params.vehicle_id;

            this.core
                .model("Vehicle")
                .findById(id)
                .then(vehicle => reply(vehicle))
                .catch(err => reply(err));
        }
    }
};
