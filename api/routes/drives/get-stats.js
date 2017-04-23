const Joi = require("joi");
const Boom = require("boom");

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
        handler: function(request, reply) {
            let id = request.params.user_id;
            let start = request.query.start;
            let end = request.query.end;

            if (start && end) {
                this.core.drive
                    .getUserDriveStats(id, start, end)
                    .then(drive => reply(drive))
                    .catch(err => reply(err));
            } else {
                // Hardcoded ranges, if a custom range is needed, use the query paramters to specify.
                let stats = {
                    today: {},
                    week: {}
                };

                this.core.drive
                    .getUserDriveStats(id, ts() - day, ts() + day)
                    .then(today => {
                        stats.today = today;
                        return this.core.drive.getUserDriveStats(
                            id,
                            ts() - day * 7,
                            ts() + day
                        );
                    })
                    .then(week => {
                        stats.week = week;
                        reply(stats);
                    })
                    .catch(err => reply(err));
            }
        }
    }
};
