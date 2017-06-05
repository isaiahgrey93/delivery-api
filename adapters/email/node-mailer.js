const EmailGatewayPort = require("./gateway-port");

class NodeMailerEmailGatewayAdapter extends EmailGatewayPort {
    constructor(nodemailer, templates) {
        super();
        this._NodeMailer = nodemailer;
        this._Templates = templates;
    }

    async sendPasswordResetEmail(to, from, data) {
        let { email, firstname, lastname } = data;

        let response = await resolve(
            new Promise((resolve, reject) => {
                let template = this._Templates.render(
                    "./templates/reset-password.html",
                    {
                        id,
                        email,
                        firstname,
                        lastname
                    },
                    (err, res) => {
                        this._NodeMailer.sendMail(
                            {
                                from: process.env.COMPANY_EMAIL_ADDRESS,
                                to: user.email,
                                subject: `Password reset request for ${user.name || user.email}.`,
                                html: html
                            },
                            (err, info) => {
                                if (err) reject(err);
                                else resolve(info);
                            }
                        );
                    }
                );
            })
        );
    }
}

module.exports = NodeMailerEmailGatewayAdapter;
