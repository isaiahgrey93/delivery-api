const { User } = require("../../common-entities");

const { omit } = require("lodash");
const Bcrypt = require("bcrypt-as-promised");

class RethinkDbUserStoreAdapter {
    constructor(thinky) {
        const { type, r } = thinky;

        this._Entity = User;
        this._Model = thinky.createModel(
            "User",
            {
                id: type.string().required().default(() => r.uuid()),
                createdAt: type.date().default(() => r.now()),
                updatedAt: type.date().default(() => r.now()),
                scope: type
                    .array()
                    .schema(
                        type
                            .string()
                            .enum(["requester", "driver", "admin"])
                            .default("requester")
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

        const UserModel = this._Model;

        this._Model.define("toJSON", function() {
            return omit(this, ["password"]);
        });

        this._Model.define("generatePassword", async function() {
            let salt = await Bcrypt.genSalt(10);
            let hash = await Bcrypt.hash(this.password, salt);

            return Object.assign(this, { password: hash });
        });

        this._Model.define("comparePassword", async function(password) {
            await Bcrypt.compare(password, this.password);

            return this;
        });

        // this._Model.pre("save", async function(next) {

        //     await this.generatePassword();

        //     } catch (e) {
        //         return next(e);
        //     }
        // });
    }

    _modelToEntity(resource) {
        return new this._Entity(resource);
    }

    async create(data) {
        let user = new this._Model(data);

        try {
            let users = await this._Model
                .filter({
                    email: this.email
                })
                .limit(1);

            if (users.length > 0) {
                return new Error("Email address is already in use.");
            }
            user = await user.generatePassword();
            user = await user.save();
            user = user.toJSON();

            return this._modelToEntity(user);
        } catch (e) {
            return e;
        }
    }

    async authenticate(data, password) {
        let user = new this._Model(data);
        try {
            await user.comparePassword(password);
            user = user.toJSON();

            return this._modelToEntity(user);
        } catch (e) {
            return new Error("Invalid email and password combination.");
        }
    }

    async findByEmail(email) {
        try {
            let [user] = await this._Model.filter({ email: email }).limit(1);

            if (!user) {
                return new Error("No user with email address.");
            }

            return this._modelToEntity(user);
        } catch (e) {
            return e;
        }
    }

    async update(data) {
        let user = new this._Model(data);

        try {
            user = await this._Model.get(data.id);
            user = await user.merge(data);
            user = await user.save();
            user = user.toJSON();

            return this._modelToEntity(user);
        } catch (e) {
            return e;
        }
    }
}

module.exports = RethinkDbUserStoreAdapter;
