const { User } = require("../../common-entities");
const UserStorePort = require("./store-port");

const { omit } = require("lodash");

class RethinkDbUserStoreAdapter extends UserStorePort {
    constructor(thinky) {
        super();
        const { type, r, Query } = thinky;

        this._ReQL = r;
        this._Query = Query;
        this._Entity = User;
        this._Model = thinky.createModel(
            "User",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(r.now()),
                updatedAt: type.date().default(() => r.now()),
                scope: type
                    .array()
                    .schema(
                        type
                            .string()
                            .enum([
                                "guest",
                                "business",
                                "consumer",
                                "driver",
                                "admin"
                            ])
                            .required()
                    ),
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
                magicLinkCode: type.any(),
                payerAccountId: type.string(),
                isOnline: type.boolean().default(false),
                geo: type.object(),
                driver: type.object().schema({
                    payeeAccountId: type.any(),
                    notes: type.array().schema(
                        type.object().schema({
                            createdAt: type.date(),
                            body: type.string()
                        })
                    ),
                    license: type.object().schema({
                        expiration: type.string(),
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

        this._Model.ensureIndex("location", this._ReQL.row("geo"), {
            geo: true
        });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let user = new this._Model(data);

        user = await resolve(user.save());

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: this._modelToEntity(user)
        };
    }

    async findByEmail(email) {
        let users = await resolve(
            this._Model.filter({ email: email }).limit(1)
        );

        if (users.error) {
            return {
                error: users.error
            };
        }

        let [user] = users.result;

        if (!user) {
            return {
                result: false
            };
        }

        return {
            result: this._modelToEntity(user)
        };
    }

    async update(data) {
        let user = new this._Model(data);

        user = await resolve(this._Model.get(data.id));

        if (user.error) {
            return {
                error: new Error("No user with id.")
            };
        }

        user = user.result;

        user = await resolve(user.merge(data));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        user = await resolve(this._Model.save(user, { conflict: "update" }));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: this._modelToEntity(user)
        };
    }

    async getById(id) {
        let user = await resolve(this._Model.get(id));

        if (user.error) {
            return {
                error: new Error("No user with id.")
            };
        }

        user = user.result;

        return {
            result: this._modelToEntity(user)
        };
    }

    async delete(id) {
        let user = await resolve(this._Model.get(id));

        if (user.error) {
            return {
                error: new Error("No user with id.")
            };
        }

        user = user.result;

        user = await resolve(user.delete());

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: this._modelToEntity(user)
        };
    }

    async getAll() {
        let users = await resolve(new this._Query(this._Model).run());

        if (users.error) {
            return {
                error: users.error
            };
        }

        users = users.result;

        return {
            result: users.map(u => this._modelToEntity(u))
        };
    }

    async filterBy(query, geometry) {
        let _Query = new this._Query(this._Model);
        _Query = this._inRadius(_Query, geometry);

        let users = await resolve(_Query.filter(query));

        if (users.error) {
            return {
                error: users.error
            };
        }

        users = users.result;

        return {
            result: users.map(u => this._modelToEntity(u))
        };
    }

    _inRadius(query, geometry = {}) {
        let { coordinates, distance } = geometry;

        if (!distance || !coordinates) return query;

        let radius = this._ReQL.circle(coordinates, distance, {
            unit: "mi"
        });

        return query.getIntersecting(radius, { index: "location" });
    }
}

module.exports = RethinkDbUserStoreAdapter;
