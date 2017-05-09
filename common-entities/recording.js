const sanitize = require("./helpers/sanitize");

function Recording(recording) {
    const { id, drive_id, url, duration, createdAt } = recording;

    this.id = id;
    this.driveId = driveId;
    this.url = url;
    this.duration = duration;
    this.createdAt = createdAt;

    return sanitize(this);
}

module.exports = Recording;
