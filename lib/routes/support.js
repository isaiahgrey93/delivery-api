'use strict';

var Twiml = require('twilio');

module.exports.open = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {

    let incoming = request.payload;
    let outgoing = new Twiml.TwimlResponse();
    let extension = incoming.Digits;

    if (!incoming.Digits) {
      outgoing.gather({
        numDigits: 4,
        action: `${process.env.BASE_URI}/api/support-call/open`
      }, (call) => call.say('Please wait while we connect you.'))

    } else {
      outgoing.dial({
        record: 'record-from-answer'
      }, (call) => {
        call.number('12085976466', {
          statusCallback: `${process.env.BASE_URI}/api/support-call/e74bb36b-4520-4121-bc96-48fd37d52dd9/close`
        })
      })
    }

    reply(outgoing.toString())
  }
}

module.exports.close = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {
    let id = request.params.drive_id;
    let incoming = request.payload;

    if (incoming.RecordingUrl) {
      let recording = new this.db.models.Recording({
          drive_id: id,
          url: incoming.RecordingUrl,
          duration: incoming.RecordingDuration
      });

      this.core.model('Recording').create(recording)
        .then(() => reply().code(204))
        .catch((err) => reply(err));

    } else {
      reply().code(204);
    }
  }
}

