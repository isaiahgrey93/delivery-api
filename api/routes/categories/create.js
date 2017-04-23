const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/categories",
    method: "POST",
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
            category.user_id = category.user_id !== undefined
                ? category.user_id
                : request.auth.credentials.id;

            this.utils.model.validate(category);

            this.core
                .model("Category")
                .create(category)
                .then(category => reply(category))
                .catch(err => reply(err));
        }
    }
};
