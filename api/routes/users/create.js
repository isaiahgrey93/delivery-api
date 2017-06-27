const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users",
    method: "POST",
    config: {
        tags: ["api"],
        auth: {
            mode: "optional"
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
                            .valid(["driver", "consumer", "business", "admin"])
                    ),
                payee_account_id: Joi.string(),
                firstname: Joi.string(),
                middle_initial: Joi.string(),
                lastname: Joi.string(),
                nickname: Joi.string(),
                profile_photo: Joi.any(),
                phone: Joi.string(),
                dob: Joi.string(),
                notes: Joi.array().items(
                    Joi.object().keys({
                        createdAt: Joi.date(),
                        body: Joi.string()
                    })
                ),
                drivers_license: Joi.object().keys({
                    expiration: Joi.string(),
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
                social_security_number: Joi.string()
            }
        },
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            let user = await resolve(this.libs.users.create(params));

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            let token = this.utils.user.grantJSONWebToken(user);

            user = toClientEntity(user);
            user.token = token;

            reply(user).header("Authorization", token);
        }
    }
};
