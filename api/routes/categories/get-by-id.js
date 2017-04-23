const Joi = require("joi");

module.exports = {
    path: "/api/categories/{category_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                category_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.category_id;
            let relations = request.query.populate;

            this.core
                .model("Category")
                .findById(id, {
                    populate: this.utils.model.populate(relations)
                })
                .then(category => reply(category))
                .catch(err => reply(err));
        }
    }
};
