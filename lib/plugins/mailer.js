"use strict";

const nodemailer = require("nodemailer");
const config = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.COMPANY_EMAIL_ADDRESS,
        pass: process.env.COMPANY_EMAIL_PASSWORD
    }
};

module.exports = nodemailer.createTransport(config);
