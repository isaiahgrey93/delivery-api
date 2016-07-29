'use strict';

const ORM = require('thinky-loader')

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
	findDriveByExtension: (ext) => {
		return ORM.models.Drive
      .filter(ORM.thinky.r.row('support')('driver_ext').eq(ext).or(ORM.thinky.r.row('support')('requester_ext').eq(ext)))
      .getJoin({
      	driver: true,
      	requester: true
      })
      .orderBy('dt_create')
      .limit(1)
      .then((drives) => drives[0])
	}
}