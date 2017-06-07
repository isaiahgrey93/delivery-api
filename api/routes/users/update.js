const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toClientEntity, toServerEntity } = require("./helpers");

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
            data.id = request.params.user_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = toServerEntity(data);

            user = await resolve(
                this.libs.users.update(params, {
                    populate: relations
                })
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            user = toClientEntity(user);

            reply(user);
        }
    }
};
