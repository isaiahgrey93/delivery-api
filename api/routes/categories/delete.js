const Joi = require("joi");

module.exports = {
    path: "/api/categories/{category_id}",
    method: "DELETE",
    config: {
        auth: {
            scope: ["requester", "admin"]
        },
        validate: {
            params: {
                category_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.category_id;

            this.core
                .model("Category")
                .remove(id)
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
