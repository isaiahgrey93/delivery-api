const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{user_id}",
    method: "GET",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.user_id;
            let data = request.payload;

            this.core
                .model("User")
                .findById(id)
                .then(user => this.utils.user.hasAccount(user))
                .then(user =>
                    this.core.stripe.accounts.getById(user.connect_id)
                )
                .then(user => reply(user))
                .catch(err => reply(err));
        }
    }
};
