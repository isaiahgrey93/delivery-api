const Joi = require("joi");

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

            let drives = await resolve(
                this.libs.drives.filterBy(
                    { [roleId]: userId },
                    {
                        populate: relations
                    }
                )
            );

            if (drives.error) {
                return reply(drives.error);
            }

            drives = drives.result;

            drives = drives.map(d => this.helpers.toClientEntity.Drive(d));

            reply(drives);
        }
    }
};
