const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{account_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                account_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let accountId = request.params.account_id;

            let account = await resolve(
                this.libs.payments.getAccountById(accountId)
            );

            if (account.error) {
                return reply(account.error);
            }

            account = account.result;

            reply(account);
        }
    }
};
