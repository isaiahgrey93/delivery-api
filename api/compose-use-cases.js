const rethinkdb = require("thinky");
const lib = require("../lib");

const {
    Users,
    Drives,
    Presets,
    Vehicles,
    Categories,
    Recordings,
    SupportExtensions
} = require("../adapters");

const {
    User,
    Drive,
    Preset,
    Vehicle,
    Category,
    Recording,
    SupportExtension
} = require("../common-entities");

const thinky = rethinkdb({
    db: process.env.RETHINKDB_DB_NAME,
    host: process.env.RETHINKDB_DB_HOST,
    port: process.env.RETHINKDB_PORT
});

const userStore = new Users.rethinkDb(thinky);
const driveStore = new Drives.rethinkDb(thinky);
const presetStore = new Presets.rethinkDb(thinky);
const vehicleStore = new Vehicles.rethinkDb(thinky);
const categoryStore = new Categories.rethinkDb(thinky);
const recordingStore = new Recordings.rethinkDb(thinky);
const supportExtensionStore = new SupportExtensions.rethinkDb(thinky);

const libs = {
    users: new lib.users({
        Entity: User,
        store: userStore
    }),
    drives: new Object({}),
    presets: new lib.presets({
        Entity: Preset,
        store: presetStore
    }),
    categories: new lib.categories({
        Entity: Category,
        store: categoryStore
    }),
    vehicles: new lib({
        Entity: Vehicle,
        store: vehicleStore
    }),
    recordings: new Object({}),
    supportExtensions: new Object({})
};

// Trick into thinking init libs exists for now

Object.keys(libs).forEach(name => {
    libs[name].initLibs = () => null;
});

Object.keys(libs).forEach(name => {
    libs[name].initLibs(libs);
});

module.exports = () => libs;
