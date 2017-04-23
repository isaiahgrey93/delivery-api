const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/users/{email}/password",
    method: "POST",
    config: {
        auth: {
            mode: "optional"
        },
        validate: {
            payload: {
                password: Joi.string().min(6).required()
            },
            params: {
                email: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let email = request.params.email;
            let new_password = request.payload.password;

            this.core.user
                .findByEmail(email)
                .then(user => {
                    if (!user) throw Boom.badRequest();
                    else return user;
                })
                .then(data => {
                    let user = new this.db.models.User(
                        Object.assign(data, {
                            password: new_password
                        })
                    );

                    return user.generatePassword();
                })
                .then(user => this.core.model("User").update(user))
                .then(user => reply(this.utils.user.sanitize(user)))
                .catch(err => reply(err));
        }
    }
};
