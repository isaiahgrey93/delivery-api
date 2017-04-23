const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{user_id}",
    method: ["PUT", "PATCH"],
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            payload: true,
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
                    this.core.stripe.accounts.update(user.connect_id, data)
                )
                .then(user => reply(user))
                .catch(err => reply(err));
        }
    }
};
