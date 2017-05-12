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

        return new Promise((resolve, reject) => {
            this._S3.upload(
                params,
                (err, res) => (err === null ? resolve(res) : reject(err))
            );
        });
    }

    delete(path) {
        let params = {
            Key: path
        };

        return new Promise((resolve, reject) => {
            this._S3.deleteObject(
                params,
                (err, res) => (err === null ? resolve(res) : reject(err))
            );
        });
    }

    getByPath(path) {
        let params = {
            Key: path
        };

        return this._S3.getObject(params).presign();
    }
}

module.exports = S3UploadGatewayAdapter;
