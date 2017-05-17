const UploadGatewayPort = require("./gateway-port");

class S3UploadGatewayAdapter extends UploadGatewayPort {
    constructor(s3) {
        super();
        this._S3 = s3;
    }

    create(path, file) {
        let params = {
            Body: file,
            Key: path,
            ContentType: "image/png"
        };

        return resolve(
            new Promise((resolve, reject) => {
                this._S3.upload(
                    params,
                    (err, res) =>
                        (err === null
                            ? resolve({ result: res })
                            : reject({ error: err }))
                );
            })
        );
    }

    delete(path) {
        let params = {
            Key: path
        };

        return resolve(
            new Promise((resolve, reject) => {
                this._S3.deleteObject(
                    params,
                    (err, res) =>
                        (err === null
                            ? resolve({ result: res })
                            : reject({ error: err }))
                );
            })
        );
    }

    getByPath(path) {
        let params = {
            Key: path
        };

        return this._S3.getObject(params).presign();
    }
}

module.exports = S3UploadGatewayAdapter;
