const Twiml = require("twilio");

module.exports = {
    path: "/api/support-call/{drive_id}/close",
    method: "POST",
    config: {
        auth: false,
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.drive_id;
            let incoming = request.payload;

            // Catch incoming call status updates that have a recording and save
            if (incoming.RecordingUrl) {
                let recording = new this.db.models.Recording({
                    drive_id: id,
                    url: incoming.RecordingUrl,
                    duration: incoming.RecordingDuration
                });

                // Create new call recording for drive
                this.core
                    .model("Recording")
                    .create(recording)
                    .then(() => reply().code(204))
                    .catch(err => reply(err));
            } else {
                reply().code(204);
            }
        }
    }
};
