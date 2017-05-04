const Joi = require("joi");
const Boom = require("boom");
const Prehandlers = require("../../../old-lib/prehandlers");
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
                notes: Joi.array().items(
                    Joi.object().keys({
                        createdAt: Joi.date(),
                        body: Joi.string()
                    })
                ),
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
                social_security_number: Joi.string()
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
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            try {
                let user = await this.libs.users.create(params);

                if (user instanceof Error) throw user;

                let token = this.utils.user.grantJSONWebToken(user);

                user = toClientEntity(user);
                user.token = token;

                return reply(user).header("Authorization", token);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
