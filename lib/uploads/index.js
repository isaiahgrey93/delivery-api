class Upload {
    constructor(args) {
        this.gateway = args.gateway;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(path, upload) {
        try {
            let newUpload = await this.gateway.create(path, upload);
            if (newUpload instanceof Error) throw newUpload;

            return newUpload;
        } catch (e) {
            return e;
        }
    }

    async getByPath(path) {
        try {
            return this.gateway.getByPath(path);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let deletedUpload = await this.gateway.delete(id);

            if (deletedUpload instanceof Error) throw deletedUpload;

            return deletedUpload;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Upload;
