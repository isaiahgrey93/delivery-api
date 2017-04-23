const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: "DELETE",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.drive_id;

            this.core
                .model("Drive")
                .remove(id)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
