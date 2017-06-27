const Joi = require("joi");

module.exports = {
    path: "/api/accounts/{account_id}",
    method: ["PUT", "PATCH"],
    config: {
        validate: {
            payload: true,
            params: {
                account_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let accountId = request.params.account_id;
            let data = request.payload;

            let account = await resolve(
                this.libs.payments.updateAccount(accountId, data)
            );

            if (account.error) {
                return reply(account.error);
            }

            account = account.result;

            reply(account);
        }
    }
};
