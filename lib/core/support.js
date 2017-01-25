'use strict';

const ORM = require('thinky-loader')
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

module.exports.extensions = {
    getAvailableExtensions: (amount) => {
        return ORM.models.SupportExtension
        .filter({
            active: false
        })
        .limit(amount)
        .update({ active : true })
        .then((extensions) => extensions)
    },
    releaseExtensions: (drive) => {
        let exts = drive.support;
        return ORM.models.SupportExtension
        .filter(
            ORM.thinky.r.row('ext').eq(exts.driver_ext)
            .or(ORM.thinky.r.row('ext').eq(exts.requester_ext))
            .or(ORM.thinky.r.row('ext').eq(exts.customer_ext))
        )
        .update({ active: false })
    },
    findDriveByExtension: (ext) => {
        return ORM.models.Drive
        .filter(
            ORM.thinky.r.row('support')('driver_ext').eq(ext)
            .or(ORM.thinky.r.row('support')('requester_ext').eq(ext))
            .or(ORM.thinky.r.row('support')('customer_ext').eq(ext))
        )
        .getJoin({
            driver: true,
            requester: true
        })
        .orderBy('dt_create')
        .limit(1)
        .then((drives) => drives[0])
    },
}

module.exports.sms = {
    send: (to, message) => {
        client.messages.create({
            to: to,
            body: message,
            from: process.env.TWILIO_PHONE,
        }, (err, data) => {
            if (err) console.log('An error occurred processing the SMS');
        });
    }
}
