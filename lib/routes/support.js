'use strict';

var Twiml = require('twilio');
const drive_progress = ['new', 'available', 'active'];

module.exports.open = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {
    let incoming = request.payload;
    let outgoing = new Twiml.TwimlResponse();
    let ext_dialed = incoming.Digits;

    if (!ext_dialed) {
    // If no extension has been dialed gather input.
      outgoing.gather({
        action: `${process.env.BASE_URI}/api/support-call/open`
      }, (call) => call.say('Please wait while we connect you.'))
      
      reply(outgoing.toString())
    } else {

      // After the input is gathered find the active drive with the extension dialed.
      this.core.support.extensions.findDriveByExtension(ext_dialed)
        .then((drive) => {

          // If drive is no longer in the active stages, reject call.
          if (drive_progress.indexOf(drive.status) < 0) {

            // Format drive date
            let drive_dt = new Date(drive.created_at).toLocaleString('en-US', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            
            // Inform caller of inactive drive status.
            outgoing
              .say(`
                The Joey request on ${drive_dt} 
                going from ${drive.route.origin.street} ${drive.route.origin.city} 
                to ${drive.route.destination.street} ${drive.route.destination.city} 
                is no longer active.
              `)
              .say('For more information regarding this drive, please call: 570-666-1670.', { loop: 2 })
              .pause(1)
              .say('Thank you.')
              .reject();

            return reply(outgoing.toString())
          }

          // Set outgoing number as the to party's whose extension was dialed
          let to = drive.support.requester_ext === ext_dialed
            ? drive.requester.phone
            : drive.driver.phone;

          // Dial out.
          outgoing.dial({
            callerId: process.env.TWILIO_PHONE,
            record: 'record-from-answer'
          }, (call) => {
            call.number(to, {
              statusCallback: `${process.env.BASE_URI}/api/support-call/${drive.id}/close`
            })
          })

        reply(outgoing.toString())
      })
    }
  }
}

module.exports.close = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {
    let id = request.params.drive_id;
    let incoming = request.payload;

    // Catch incoming call status updates that have a recording and save
    if (incoming.RecordingUrl) {
      let recording = new this.db.models.Recording({
          drive_id: id,
          url: incoming.RecordingUrl,
          duration: incoming.RecordingDuration
      });

      // Create new call recording for drive
      this.core.model('Recording').create(recording)
        .then(() => reply().code(204))
        .catch((err) => reply(err));

    } else {
      reply().code(204);
    }
  }
}

