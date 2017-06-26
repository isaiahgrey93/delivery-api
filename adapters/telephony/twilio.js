const TelphonyGatewayPort = require("./gateway-port");
const Utils = require("../../utils");

class TwilioTelphonyGatewayAdapter extends TelphonyGatewayPort {
    constructor(twilio) {
        super();
        this._Twilio = twilio;
    }

    async sendSms(to, message) {
        let response = await resolve(
            new Promise((resolve, reject) => {
                this._Twilio.messages.create(
                    {
                        to: to,
                        body: message,
                        from: process.env.TWILIO_PHONE
                    },
                    (err, data) => (err ? reject(false) : resolve(true))
                );
            })
        );

        if (response.error) {
            return {
                error: new Error("An error occurred processing SMS.")
            };
        }

        return {
            result: true
        };
    }
}

module.exports = TwilioTelphonyGatewayAdapter;
