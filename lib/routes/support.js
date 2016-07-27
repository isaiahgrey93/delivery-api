'use strict';

var Twiml = require('twilio');

module.exports.start = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {

    let incoming = request.payload;
    let outgoing = new Twiml.TwimlResponse();
    let extension = incoming.Digits;

    	if (!incoming.Digits) {
    		console.log('Gathering Extension')
    		outgoing.say('Please wait while we connect you.')
    		outgoing.gather({
	    		numDigits: 4,
	    		// finishOnKey: '#',
	    		action: 'http://tqnznathqj.localtunnel.me/api/support/open'
	    	})
    	} else {
    		console.log('Placing call to extension', incoming.Digits)
    		outgoing.dial('12085976466', {
	    		record: 'record-from-answer',
	    		action: 'http://tqnznathqj.localtunnel.me/api/support/status'
	    	})
    	}

    	reply(outgoing.toString())
  }
}

module.exports.status = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {

  	console.log('Call finished.');
  	// console.log(request.payload)

    reply()
  }
}

