const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{user_id}",
    method: "POST",
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
                .then(user => {
                    data.email = user.email;
                    return this.core.stripe.accounts.create(data);
                })
                .then(account =>
                    this.core
                        .model("User")
                        .update({ id: id, connect_id: account.id })
                )
                .then(user => reply(this.utils.user.sanitize(user)))
                .catch(err => reply(err));
        }
    }
};
