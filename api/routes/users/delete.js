const Joi = require("joi");

module.exports = {
    path: "/api/users/{user_id}",
    method: "DELETE",
    config: {
        auth: {
            scope: ["admin"]
        },
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.user_id;

            this.core
                .model("User")
                .remove(id)
                .then(user => this.utils.user.sanitize(user))
                .then(user => reply(user))
                .catch(err => reply(err));
        }
    }
};
