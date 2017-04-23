"use strict";

const AWS = require("aws-sdk");

module.exports.S3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    params: {
        Bucket: process.env.AWS_BUCKET,
        ACL: "bucket-owner-full-control"
    }
});
