const Joi = require("joi");

module.exports = {
    path: "/api/users",
    method: "GET",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let relations = request.query.populate;

            this.core
                .model("User")
                .getAll({
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
