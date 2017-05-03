const Joi = require("joi");
const Boom = require("boom");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/users/{user_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        plugins: {
            policies: ["isAdminOrOwner", "restrictAdminFields"]
        },
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
            let user = request.payload;
            let relations = request.query.populate;
            user.id = request.params.user_id;

            try {
                user = await this.libs.users.update(user);
                return reply(user);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
