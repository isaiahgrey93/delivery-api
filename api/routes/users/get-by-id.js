const Joi = require("joi");

module.exports = {
    path: "/api/users/{user_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.user_id;
            let relations = request.query.populate;

            this.core
                .model("User")
                .findById(id, {
                    populate: this.utils.model.populate(relations),
                    without: {
                        password: true
                    }
                })
                .then(user => reply(this.utils.user.sanitize(user)))
                .catch(err => reply(err));
        }
    }
};
