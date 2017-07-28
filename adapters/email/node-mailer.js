const EmailGatewayPort = require("./gateway-port");

class NodeMailerEmailGatewayAdapter extends EmailGatewayPort {
    constructor(nodemailer) {
        super();
        this._transporter = nodemailer;
    }

    async sendMagicLink(url, data) {
        let {
            email = "",
            firstname = "",
            lastname = "",
            magicLinkCode = ""
        } = data;

        let response = await resolve(
            new Promise((resolve, reject) => {
                let sendMagicLink = this._transporter.templateSender(
                    {
                        subject: "Magic link for {{email}}!",
                        text: "Hello, {{name}}, here is your magic login link {{link}}.",
                        html: '<p>Hello <strong>{{name}}</strong>, <br />Here is your <a href="{{link}}">magic login link</a>.</p>'
                    },
                    {
                        from: process.env.COMPANY_EMAIL_ADDRESS
                    }
                );

                sendMagicLink(
                    {
                        to: email
                    },
                    {
                        email,
                        name: `${firstname} ${lastname}`,
                        link: `${url}/${magicLinkCode}`
                    },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
            })
        );

        if (response.error) {
            return {
                error: response.error
            };
        }

        return {
            result: response.result
        };
    }
}

module.exports = NodeMailerEmailGatewayAdapter;
