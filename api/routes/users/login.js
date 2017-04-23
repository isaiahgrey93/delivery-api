const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/users/login",
    method: "POST",
    config: {
        auth: false,
        validate: {
            query: {
                populate: Joi.string()
            },
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let credentials = request.payload;
            let relations = request.query.populate;

            this.core.user
                .findByEmail(credentials.email)
                .then(
                    user =>
                        (!user
                            ? Boom.badRequest(
                                  `Email <${credentials.email}> and password combination is incorrect.`
                              )
                            : user.comparePassword(credentials.password))
                )
                .then(res => {
                    if (res.isBoom) return res;
                    else {
                        return this.core.model("User").findById(res.id, {
                            populate: this.utils.model.populate(relations),
                            without: {
                                password: true
                            }
                        });
                    }
                })
                .then(user => {
                    if (user.isBoom) return reply(user);

                    let account = this.utils.user.sanitize(user);
                    let token = this.utils.user.grantJSONWebToken(account);

                    account.token = token;

                    reply(account).header("Authorization", token);
                })
                .catch(err => reply(err));
        }
    }
};
