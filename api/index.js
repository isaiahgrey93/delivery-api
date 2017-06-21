"use strict";

const Node_utils = require("util");
const Routes = require("./routes");
const Domain = require("domain");

const utils = require("../utils");

const libs = require("./compose-use-cases")();
const helpers = require("./helpers");

module.exports.register = (server, options, next) => {
    server.auth.strategy("jwt", "jwt", {
        key: process.env.JWT_SECRET,
        validateFunc: (decoded, request, callback) => {
            if (!decoded.id) return callback(null, false);
            else return callback(null, true);
        },
        verifyOptions: {
            algorithms: ["HS256"]
        }
    });

    server.auth.default({ strategy: "jwt" });

    server.bind({
        libs,
        helpers,
        utils
    });

    server.ext("onPreResponse", function(request, reply) {
        let res = request.response;

        if (res instanceof Error) {
            let error = {
                error: res.output.payload.error,
                status: res.output.payload.statusCode,
                message: res.message,
                time: new Date().toLocaleString("en-US")
            };

            if (process.env.NODE_ENV === "production") {
                console.error(error);
            } else {
                console.error(
                    `\n`,
                    Node_utils.inspect(error, { colors: true }),
                    "\n"
                );
            }

            return reply(error).code(error.status);
        }

        return reply.continue();
    });

    server.route(Routes);

    next();
};

module.exports.register.attributes = {
    name: "api",
    version: "1.0.0"
};
