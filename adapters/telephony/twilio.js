const TelphonyGatewayPort = require("./gateway-port");
const Utils = require("../../utils");

class TwilioTelphonyGatewayAdapter extends TelphonyGatewayPort {
    constructor(twilio) {
        super();
        this._Twilio = twilio;
    }
}

module.exports = TwilioTelphonyGatewayAdapter;
