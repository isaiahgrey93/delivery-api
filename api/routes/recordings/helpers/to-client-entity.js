const sanitize = require("./sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        drive_id: data.driveId,
        duration: data.duration,
        url: data.url
    });
};
