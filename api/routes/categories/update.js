const Joi = require("joi");
const Prehandlers = require("../prehandlers");

module.exports = {
    path: "/api/categories/{category_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        auth: {
            scope: ["requester", "admin"]
        },
        validate: {
            payload: {
                name: Joi.string(),
                description: Joi.string(),
                image: Joi.any(),
                user_id: Joi.string()
            },
            params: {
                category_id: Joi.string().required()
            }
        },
        pre: [
            {
                assign: "image",
                method: Prehandlers.upload("image")
            }
        ],
        handler: function(request, reply) {
            let category = new this.db.models.Category(request.payload);
            category.id = request.params.category_id;

            this.utils.model.validate(category);

            this.core
                .model("Category")
                .update(category)
                .then(category => reply(category))
                .catch(err => reply(err));
        }
    }
};
