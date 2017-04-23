const Joi = require("joi");

module.exports = {
    path: "/api/accounts",
    method: "GET",
    config: {
        auth: {
            scope: ["admin"]
        },
        validate: {
            query: {
                limit: Joi.string().optional()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let limit = request.params.limit;

            this.core.stripe.accounts
                .getAll(limit)
                .then(users => reply(users))
                .catch(err => reply(err));
        }
    }
};
