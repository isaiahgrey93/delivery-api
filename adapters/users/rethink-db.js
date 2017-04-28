const { User } = require("../../common-entities");

class RethinkDbUserStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._model = thinky.createModel(
            "User",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                email: type.string(),
                password: type.string().min(6),
                nickname: type.string(),
                lastname: type.string(),
                firstname: type.string(),
                middleInitial: type.string(),
                address: type.object().schema({
                    street: type.string(),
                    city: type.string(),
                    state: type.string(),
                    zip: type.string()
                }),
                dob: type.string(),
                ssn: type.string(),
                phone: type.string(),
                avatar: type.string(),
                driver: type.object().schema({
                    paymentAccountId: type.any(),
                    notes: type.array().schema(
                        type.object().schema({
                            createdAt: type.date(),
                            body: type.string()
                        })
                    ),
                    license: type.object().schema({
                        expiryMonth: type.string(),
                        expiryYear: type.string(),
                        number: type.string(),
                        photo: type.string(),
                        state: type.string()
                    }),
                    status: type
                        .string()
                        .enum(["unverified", "verified", "rejected"])
                        .default("unverified")
                })
            },
            {
                table: {
                    durability: "hard"
                }
            }
        );

        this._Entity = User;
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }
}

module.exports = RethinkDbUserStoreAdapter;
