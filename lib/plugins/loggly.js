"use strict";

var winston = require("winston");
var util = require("util");
require("winston-loggly-bulk");

winston.add(winston.transports.Loggly, {
    token: "873a5150-b760-40ca-99e5-4c1860e83597",
    subdomain: "appersonlabs",
    tags: ["joey-api"],
    json: true
});

// console.log = function(){
//     winston.log('log', arguments);
// };
// console.info = function() {
//     winston.info('info', arguments);
// };
// console.warn = function() {
//     winston.warn('warn', arguments);
// };
// console.error = function() {
//     winston.error('error', arguments);
// };
// console.debug = function(){
//     winston.debug('debug', arguments);
// };
