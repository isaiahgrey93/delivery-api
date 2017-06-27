const { keyBy } = require("lodash");
const uuid = require("uuid");

class User {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
        this.passwordHash = args.passwordHash;
        this.emailLib = args.emailLib;
        this.telephonyLib = args.telephonyLib;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async validateMagicLink(code) {
        let users = await resolve(this.store.filterBy({ magicLinkCode: code }));

        if (users.error) {
            return {
                error: users.error
            };
        }

        let [user = false] = users.result;

        if (!user) {
            return {
                error: new Error("Invalid magic link code.")
            };
        }

        user = await resolve(
            this.store.update({ id: user.id, magicLinkCode: false })
        );

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: user
        };
    }

    async generateMagicLink(data) {
        let { email, phone } = data;

        if (email) {
            let user = await resolve(this.store.findByEmail(email));

            if (user.error) {
                return {
                    error: user.error
                };
            }

            user = user.result;

            user = await resolve(
                this.store.update({ id: user.id, magicLinkCode: uuid.v4() })
            );

            if (user.error) {
                return {
                    error: user.error
                };
            }

            user = user.result;

            let response = await resolve(
                this.emailLib.sendMagicLink(
                    Object.assign({}, user, { email: "isaiahgrey@gmail.com" })
                )
            );

            if (response.error) {
                return {
                    error: false
                };
            }

            return {
                result: true
            };
        }

        if (phone) {
            let users = await resolve(this.store.filterBy({ phone }));

            if (users.error) {
                return {
                    error: users.error
                };
            }

            let [user = false] = users.result;

            user = await resolve(
                this.store.update({ id: user.id, magicLinkCode: uuid.v4() })
            );

            if (user.error) {
                return {
                    error: user.error
                };
            }

            user = user.result;

            let response = await resolve(
                this.telephonyLib.sendSms(
                    phone,
                    `Here is your magic link: ${process.env.CLIENT_HOST}/magic/${user.magicLinkCode}`
                )
            );

            if (response.error) {
                return {
                    error: false
                };
            }

            return {
                result: true
            };
        }

        return {
            error: new Error("Invalid email or phone number entered.")
        };
    }

    async authenticate(credentials) {
        let { email, password } = credentials;

        let user = await resolve(this.store.findByEmail(email));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        if (user === false) {
            return {
                error: new Error("Invalid email and password combination")
            };
        }

        let authenticated = await resolve(
            this.passwordHash.doesPasswordMatchHash(password, user.password)
        );

        if (authenticated.error) {
            return {
                error: authenticated.error
            };
        }

        if (authenticated.result === false) {
            return {
                error: new Error("Invalid email and password combination")
            };
        }

        return {
            result: user
        };
    }

    async resetPassword(email, newPassword) {
        let user = await resolve(this.store.findByEmail(email));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        if (user === false) {
            return {
                error: new Error("Email address is not registered.")
            };
        }

        let passwordHash = await this.passwordHash.generatePasswordHash(
            newPassword
        );

        if (passwordHash.error) {
            return {
                error: passwordHash.error
            };
        }

        passwordHash = passwordHash.result;

        user.password = passwordHash;

        user = new this.Entity(user);

        user = await resolve(this.libs.users.store.update(user));

        if (user.error) {
            return {
                error: user.error
            };
        }

        user = user.result;

        return {
            result: user
        };
    }

    async createGuest() {
        let newGuest = await resolve(this.store.create({ scope: ["guest"] }));

        if (newGuest.error) {
            return {
                error: newGuest.error
            };
        }

        return {
            result: newGuest.result
        };
    }

    async create(user) {
        let newUser = new this.Entity(user);

        user = await resolve(this.store.findByEmail(newUser.email));

        if (user.error) {
            return {
                error: users.error
            };
        }

        if (user.result) {
            return {
                error: new Error("Email address is already in use.")
            };
        }

        let password = await resolve(
            this.passwordHash.generatePasswordHash(newUser.password)
        );

        if (password.error) {
            return {
                error: password.error
            };
        }

        newUser.password = password.result;

        newUser = await resolve(this.store.create(newUser));

        if (newUser.error) {
            return {
                error: newUser.error
            };
        }

        return {
            result: newUser.result
        };
    }

    async update(user, options = {}) {
        let { id, email } = user;

        if (email) {
            let fetchedUser = await resolve(this.store.getById(id));

            if (fetchedUser.error) {
                return {
                    error: fetchedUser.error
                };
            }

            fetchedUser = fetchedUser.result;

            let userWithEmail = await resolve(
                this.store.findByEmail(user.email)
            );

            if (userWithEmail.error) {
                return {
                    error: userWithEmail.error
                };
            }

            userWithEmail = userWithEmail.result;

            if (
                userWithEmail !== false &&
                fetchedUser.email !== userWithEmail.email
            ) {
                return {
                    error: new Error("Email address is already in use.")
                };
            }
        }

        let updatedUser = new this.Entity(user);

        updatedUser = await resolve(this.store.update(updatedUser));

        if (updatedUser.error) {
            return {
                error: updatedUser.error
            };
        }

        updatedUser = updatedUser.result;

        updatedUser = await resolve(
            this.libs.users.populate(updatedUser, options.populate)
        );

        if (updatedUser.error) {
            return {
                error: updatedUser.error
            };
        }

        return {
            result: updatedUser.result
        };
    }

    async delete(id) {
        let fetchedUser = await resolve(this.store.delete(id));

        if (fetchedUser.error) {
            return {
                error: fetchedUser.error
            };
        }

        return {
            result: fetchedUser.result
        };
    }

    async getById(id, options = {}) {
        let fetchedUser = await resolve(this.store.getById(id));

        if (fetchedUser.error) {
            return {
                error: fetchedUser.error
            };
        }

        fetchedUser = fetchedUser.result;

        fetchedUser = await resolve(
            this.libs.users.populate(fetchedUser, options.populate)
        );

        if (fetchedUser.error) {
            return {
                error: fetchedUser.error
            };
        }

        return {
            result: fetchedUser.result
        };
    }

    async getAll(options = {}) {
        let fetchedUsers = await resolve(this.store.getAll());

        if (fetchedUsers.error) {
            return {
                error: fetchedUsers.error
            };
        }

        fetchedUsers = fetchedUsers.result;

        fetchedUsers = await Promise.all(
            fetchedUsers.map(async u => {
                u.vehicleId = "hello";
                u = await resolve(
                    this.libs.users.populate(u, options.populate)
                );

                if (u.error) {
                    return u.error;
                }

                return u.result;
            })
        );

        return {
            result: fetchedUsers
        };
    }

    async getByRole(role, options = {}) {
        let fetchedUsers = await resolve(
            this.store.filterBy({ scope: [role] })
        );

        if (fetchedUsers.error) {
            return {
                error: fetchedUsers.error
            };
        }

        fetchedUsers = fetchedUsers.result;

        fetchedUsers = await Promise.all(
            fetchedUsers.map(async u => {
                u.vehicleId = "hello";
                u = await resolve(
                    this.libs.users.populate(u, options.populate)
                );

                if (u.error) {
                    return u.error;
                }

                return u.result;
            })
        );

        return {
            result: fetchedUsers
        };
    }

    async filterBy(query, options = {}) {
        let fetchedUsers = await resolve(this.store.filterBy(query));

        if (fetchedUsers.error) {
            return {
                error: fetchedUsers.error
            };
        }

        fetchedUsers = fetchedUsers.result;

        fetchedUsers = await Promise.all(
            fetchedUsers.map(async u => {
                u.vehicleId = "hello";
                u = await resolve(
                    this.libs.users.populate(u, options.populate)
                );

                if (u.error) {
                    return u.error;
                }

                return u.result;
            })
        );

        return {
            result: fetchedUsers
        };
    }

    async populate(user, relations) {
        let { vehicle, truck, categories, presets } = keyBy(relations);

        if (categories) {
            let userCategories = await resolve(
                this.libs.categories.filterBy(
                    {
                        userId: user.id
                    },
                    {
                        populate: [presets]
                    }
                )
            );

            if (!userCategories.error) {
                user.categories = userCategories.result;
            }
        }

        if (vehicle) {
            let vehicles = await resolve(
                this.libs.vehicles.filterBy(
                    {
                        userId: user.id
                    },
                    {
                        populate: [truck]
                    }
                )
            );

            if (!vehicles.error) {
                let [userVehicle] = vehicles.result;

                user.vehicle = userVehicle;
            }
        }

        return {
            result: user
        };
    }
}

module.exports = User;
