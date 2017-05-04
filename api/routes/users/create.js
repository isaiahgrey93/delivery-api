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
                social_security_number: Joi.string(),
                isOnline: Joi.boolean()
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

            let { drivers_license = {} } = data;

            let params = {
                email: data.email,
                scope: data.scope,
                password: data.password,
                nickname: data.nickname,
                lastname: data.lastname,
                firstname: data.firstname,
                middleInitial: data.middle_initial,
                dob: data.dob,
                ssn: data.social_security_number,
                phone: data.phone,
                avatar: data.profile_photo,
                driver: {
                    notes: data.notes,
                    status: data.status,
                    paymentAccountId: data.connect_id,
                    license: {
                        state: drivers_license.state,
                        photo: drivers_license.photo,
                        number: drivers_license.number,
                        expiryYear: drivers_license.expiry_year,
                        expiryMonth: drivers_license.expiry_month
                    }
                },
                address: data.address
            };

            try {
                let user = await this.libs.users.create(params);
                let token = this.utils.user.grantJSONWebToken(user);

                user.token = token;
                return reply(user).header("Authorization", token);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
