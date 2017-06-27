const Twiml = require("twilio");

module.exports = {
    path: "/api/support-call/{drive_id}/close",
    method: "POST",
    config: {
        auth: false,
        tags: ["api"],
        handler: async function(request, reply) {
            let driveId = request.params.drive_id;
            let incoming = request.payload;

            if (incoming.RecordingUrl) {
                let recording = await resolve(
                    this.libs.recordings.create({
                        driveId,
                        url: incoming.RecordingUrl,
                        duration: incoming.RecordingDuration
                    })
                );

                if (recording.error) {
                    return reply(recording.error);
                }
                recording = recording.result;

                reply(recording);
            } else {
                reply().code(204);
            }
        }
    }
};
