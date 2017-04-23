const Joi = require("joi");

module.exports = {
    path: "/api/categories",
    method: "GET",
    config: {
        tags: ["api"],
        validate: {
            query: {
                populate: Joi.string().optional()
            }
        },
        handler: function(request, reply) {
            let relations = request.query.populate;

            this.core
                .model("Category")
                .getAll({
                    populate: this.utils.model.populate(relations)
                })
                .then(category => reply(category))
                .catch(err => reply(err));
        }
    }
};
