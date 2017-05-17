require("../global");

const rethinkdb = require("thinky");
const bcrypt = require("bcrypt-as-promised");
const aws = require("aws-sdk");

const lib = require("../lib");

const {
    Users,
    Drives,
    Presets,
    Uploads,
    Vehicles,
    Categories,
    Recordings,
    PasswordHash,
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

let awsS3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    params: {
        Bucket: process.env.AWS_BUCKET,
        ACL: "bucket-owner-full-control"
    }
});

let passwordHashLib = new PasswordHash.bcrypt(bcrypt);

const uploadGateway = new Uploads.s3(awsS3);
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
        store: userStore,
        passwordHash: passwordHashLib
    }),
    drives: new lib.drives({
        Entity: Drive,
        store: driveStore
    }),
    presets: new lib.presets({
        Entity: Preset,
        store: presetStore
    }),
    categories: new lib.categories({
        Entity: Category,
        store: categoryStore
    }),
    vehicles: new lib.vehicles({
        Entity: Vehicle,
        store: vehicleStore
    }),
    uploads: new lib.uploads({
        gateway: uploadGateway
    }),
    recordings: new lib.recordings({
        Entity: Recording,
        store: recordingStore
    }),
    supportExtensions: new lib.supportExtensions({
        Entity: SupportExtension,
        store: supportExtensionStore
    })
};

Object.keys(libs).forEach(name => libs[name].initLibs(libs));

module.exports = () => libs;
