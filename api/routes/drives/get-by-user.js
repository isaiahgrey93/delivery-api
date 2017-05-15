const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/{user_id}/{role}",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required(),
                role: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;

            let { user_id, role } = request.params;

            let userId = user_id;
            let roleId = "";

            if (role === "driver") roleId = "driverId";
            else roleId = "requesterId";

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            try {
                let drives = await this.libs.drives.filterBy(
                    { [roleId]: userId },
                    {
                        populate: relations
                    }
                );

                drives = drives.map(d => toClientEntity(d));

                reply(drives);
            } catch (e) {
                reply(e);
            }
        }
    }
};
