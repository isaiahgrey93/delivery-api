const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{user_id}",
    method: "DELETE",
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

            this.core
                .model("User")
                .findById(id)
                .then(user => this.utils.user.hasAccount(user))
                .then(user => this.core.stripe.accounts.remove(user.connect_id))
                .then(account =>
                    this.core
                        .model("User")
                        .update({ id: id, connect_id: false })
                )
                .then(user => reply(this.utils.user.sanitize(user)))
                .catch(err => reply(err));
        }
    }
};
