class Upload {
    constructor(args) {
        this.gateway = args.gateway;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(path, upload) {
        let newUpload = await resolve(this.gateway.create(path, upload));

        if (newUpload.error) {
            return {
                error: newUpload.error
            };
        }

        newUpload = newUpload.result;

        return {
            result: newUpload
        };
    }

    async getByPath(path) {
        return this.gateway.getByPath(path);
    }

    async delete(id) {
        let deletedUpload = await resolve(this.gateway.delete(id));

        if (deletedUpload.error) {
            return {
                error: deletedUpload.error
            };
        }

        deletedUpload = deletedUpload.result;

        return {
            result: deletedUpload
        };
    }
}

module.exports = Upload;
