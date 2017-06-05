const sanitize = require("../sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        driveId: data.drive_id,
        duration: data.duration,
        url: data.url
    });
};
