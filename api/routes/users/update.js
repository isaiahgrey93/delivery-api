const Joi = require("joi");
const Boom = require("boom");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/users/{user_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        validate: {
            payload: {
                email: Joi.string().email(),
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
                connect_id: Joi.any(),
                status: Joi.string().valid(
                    "unverified",
                    "verified",
                    "rejected"
                ),
                scope: Joi.array().items(
                    Joi.string()
                        .valid(["driver", "requester", "admin"])
                        .required()
                ),
                social_security_number: Joi.string(),
                isOnline: Joi.boolean(),
                geo: Joi.object()
            },
            params: {
                user_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },

        handler: async function(request, reply) {
            let data = request.payload;
            let relations = request.query.populate;
            data.id = request.params.user_id;

            let { drivers_license = {} } = data;

            let params = {
                id: data.id,
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
                user = await this.libs.users.update(params);
                return reply(user);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
