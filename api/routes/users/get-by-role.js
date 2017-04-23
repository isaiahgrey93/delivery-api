const Joi = require("joi");

module.exports = {
    path: "/api/users/{user_role}s/role",
    method: "GET",
    config: {
        auth: {
            scope: ["admin"]
        },
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let role = request.params.user_role;
            let relations = request.query.populate;

            this.core.user
                .findByRole(role, {
                    populate: this.utils.model.populate(relations),
                    without: {
                        password: true
                    }
                })
                .then(users => reply(this.utils.user.sanitize(users)))
                .catch(err => reply(err));
        }
    }
};
