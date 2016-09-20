'use strict';

const S3 = require('../plugins/aws').S3;

module.exports = {
    create: (path, file) => {
        let params = {
            Body: file,
            Key: path,
        };

        return new Promise((resolve, reject) => {
            S3.upload(
                params,
                (err, res) => err === null ? resolve(res) : reject(err)
            )
        });
    },
    remove: (path) => {
        let params = {
            Key: path,
        };

        return new Promise((resolve, reject) => {
            S3.deleteObject(
                params,
                (err, res) => err === null ? resolve(res) : reject(err)
            )
        });
    },
    fetch: (path) => {
        let params = {
            Key: path,
        };

        return S3.getObject(params).presign();
    },
}
