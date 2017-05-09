const sanitize = require("./helpers/sanitize");

function SupportExtension(supportExtension) {
    const { id, ext, active } = supportExtension;

    this.id = id;
    this.ext = ext;
    this.active = active;

    return sanitize(this);
}

module.exports = SupportExtension;
