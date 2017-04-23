const Joi = require("joi");
const Boom = require("boom");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/users",
    method: "POST",
    config: {
        tags: ["api"],
        auth: {
            mode: "optional"
        },
        plugins: {
            policies: ["restrictAdminCreation"]
        },
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                scope: Joi.array()
                    .required()
                    .items(
                        Joi.string()
                            .required()
                            .valid(["driver", "requester", "admin"])
                    ),
                connect_id: Joi.string(),
                firstname: Joi.string(),
                middle_initial: Joi.string(),
                lastname: Joi.string(),
                nickname: Joi.string(),
                profile_photo: Joi.any(),
                phone: Joi.string(),
                dob: Joi.string(),
                rating: Joi.number(),
                drivers_license: Joi.object().keys({
                    expiry_month: Joi.string(),
                    expiry_year: Joi.string(),
                    number: Joi.string(),
                    photo: Joi.any(),
                    state: Joi.string()
                }),
                address: {
                    street: Joi.string(),
                    city: Joi.string(),
                    state: Joi.string(),
                    zip: Joi.string()
                },
                status: Joi.string().valid(
                    "unverified",
                    "verified",
                    "rejected"
                ),
                social_security_number: Joi.string(),
                isOnline: Joi.boolean(),
                geo: Joi.object()
            }
        },
        pre: [
            {
                assign: "profile_photo",
                method: Prehandlers.upload("profile_photo")
            },
            {
                assign: "drivers_license.photo",
                method: Prehandlers.upload("drivers_license.photo")
            }
        ],
        handler: function(request, reply) {
            let user = new this.db.models.User(request.payload);

            this.utils.model.validate(user);

            this.core
                .model("User")
                .create(user)
                .then(user => {
                    let account = this.utils.user.sanitize(user);
                    let token = this.utils.user.grantJSONWebToken(account);

                    account.token = token;

                    reply(account).header("Authorization", token);
                })
                .catch(err => reply(err));
        }
    }
};
