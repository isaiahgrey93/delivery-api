require("../global");

const rethinkdb = require("thinky");
const bcrypt = require("bcrypt-as-promised");
const googleMaps = require("@google/maps");
const stripe = require("stripe");
const aws = require("aws-sdk");

const lib = require("../lib");

const {
    Geo,
    Users,
    Drives,
    Presets,
    Uploads,
    Payments,
    Trucks,
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
    Truck,
    Vehicle,
    Category,
    Recording,
    SupportExtension
} = require("../common-entities");

const thinky = rethinkdb({
    db: process.env.RETHINKDB_NAME,
    host: process.env.RETHINKDB_HOST,
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

let stripeLib = stripe(process.env.STRIPE_SECRET);

const googleMapsClient = googleMaps.createClient({
    key: process.env.GOOGLEMAPS_API_KEY,
    Promise
});

let passwordHashLib = new PasswordHash.bcrypt(bcrypt);
let geoLib = new Geo.googleMaps(googleMapsClient);

const uploadGateway = new Uploads.s3(awsS3);
const paymentGateway = new Payments.stripe(stripeLib);

const userStore = new Users.rethinkDb(thinky);
const driveStore = new Drives.rethinkDb(thinky);
const truckStore = new Trucks.rethinkDb(thinky);
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
        store: driveStore,
        geo: geoLib
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
    trucks: new lib.trucks({
        Entity: Truck,
        store: truckStore
    }),
    payments: new lib.payments({
        gateway: paymentGateway
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
