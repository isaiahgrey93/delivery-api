const Joi = require("joi");

// units in milliseconds
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const ts = () => new Date().getTime();

module.exports = {
    path: "/api/drives/{user_id}/stats",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            },
            query: {
                start: Joi.number(),
                end: Joi.number()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let driverId = request.params.user_id;
            let { start, end } = request.query;

            let weekStats = await resolve(
                this.libs.drives.driverStats(driverId, {
                    start: (start = ts() - day * 7),
                    end: (end = ts() + day)
                })
            );

            if (weekStats.error) {
                return reply(weekStats.error);
            }

            weekStats = weekStats.result;

            let dayStats = await resolve(
                this.libs.drives.driverStats(driverId, {
                    start: (start = ts() - day),
                    end: (end = ts() + day)
                })
            );

            if (dayStats.error) {
                return reply(weekStats.error);
            }

            dayStats = dayStats.result;

            let stats = {
                today: dayStats,
                week: weekStats
            };

            reply(stats);
        }
    }
};
