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
    		outgoing.say('Please wait while we connect you.')
    		outgoing.gather({
	    		numDigits: 4,
	    		action: 'http://mqbkoanngb.localtunnel.me/api/support/open'
	    	})
    	} else {
    		outgoing.dial('12085976466', {
	    		record: 'record-from-answer',
	    		action: 'http://mqbkoanngb.localtunnel.me/api/support/status'
	    	})
    	}

    	reply(outgoing.toString())
  }
}

module.exports.status = {
  auth: false,
  tags: ['api'],
  handler: function (request, reply) {
    
    let incoming = request.payload;
    let outgoing = new Twiml.TwimlResponse();

  	if (incoming.callbackStatus === 'complete' ) outgoing.hangup()

    reply(outgoing.toString())
  }
}

