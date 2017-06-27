const Twiml = require("twilio");
const drive_progress = [
    "unpaid",
    "available",
    "accepted",
    "loading",
    "driving"
];

// TODO refactor to new arch

module.exports = {
    path: "/api/support-call/open",
    method: "POST",
    config: {
        auth: false,
        tags: ["api"],
        handler: function(request, reply) {
            let incoming = request.payload;
            let outgoing = new Twiml.TwimlResponse();
            let ext_dialed = incoming.Digits;

            if (!ext_dialed) {
                // If no extension has been dialed gather input.
                outgoing.gather(
                    {
                        action: `/api/support-call/open`
                    },
                    call => call.say("Please wait while we connect you.")
                );

                reply(outgoing.toString());
            } else {
                // After the input is gathered find the active drive with the extension dialed.
                this.core.support.extensions
                    .findDriveByExtension(ext_dialed)
                    .then(drive => {
                        // If drive is no longer in the active stages, reject call.
                        if (drive_progress.indexOf(drive.status) < 0) {
                            // Format drive date
                            let drive_dt = new Date(
                                drive.created_at
                            ).toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });

                            // Inform caller of inactive drive status.
                            outgoing
                                .say(
                                    `
                        The Joey request on ${drive_dt}
                        going from ${drive.route.origin.street} ${drive.route.origin.city}
                        to ${drive.route.destination.street} ${drive.route.destination.city}
                        is no longer active.
                        `
                                )
                                .say(
                                    `For more information regarding this drive, please call: ${process.env.TWILIO_PHONE}.`,
                                    { loop: 2 }
                                )
                                .pause(1)
                                .say("Thank you.")
                                .reject();

                            return reply(outgoing.toString());
                        }

                        // Set outgoing number as the to party's whose extension was dialed
                        let toNumber;
                        let toPartyMessage;
                        let {
                            requester_ext,
                            customer_ext,
                            driver_ext
                        } = drive.support;

                        switch (ext_dialed) {
                            case requester_ext:
                                toNumber = drive.requester.phone;
                                toPartyMessage = `Calling the joey partner store.`;
                                break;
                            case driver_ext:
                                toNumber = drive.driver
                                    ? drive.driver.phone
                                    : drive.requester.phone;
                                toPartyMessage = drive.driver
                                    ? "Calling the joey driver."
                                    : "No driver has been assigned to this shipment. Calling the joey partner store.";
                                break;
                            default:
                                toNumber = drive.customer.phone;
                                toPartyMessage = `Calling the customer.`;
                                break;
                        }

                        outgoing.say(toPartyMessage).pause(1).dial({
                            callerId: `${process.env.TWILIO_PHONE}`,
                            record: "record-from-answer"
                        }, call => {
                            call.number(toNumber, {
                                statusCallback: `https://joey-api.now.sh/api/support-call/${drive.id}/close`
                            });
                        });

                        reply(outgoing.toString());
                    });
            }
        }
    }
};
