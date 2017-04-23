const Joi = require("joi");

module.exports = {
    path: "/api/vehicles",
    method: "GET",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        tags: ["api"],
        handler: function(request, reply) {
            this.core
                .model("Vehicle")
                .getAll()
                .then(vehicle => reply(vehicle))
                .catch(err => reply(err));
        }
    }
};
