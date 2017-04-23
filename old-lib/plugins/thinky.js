"use strict";

const ThinkyLoader = require("thinky-loader");

module.exports.register = (server, options, next) => {
    ThinkyLoader.initialize(options)
        .then(() => {
            let orm = require("thinky-loader");
            server.expose({ thinky: orm });
            next();
        })
        .catch(err => {
            next(err);
        });
};

module.exports.register.attributes = {
    name: "orm",
    version: "1.0.0"
};
