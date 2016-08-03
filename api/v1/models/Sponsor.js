/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Sponsor = Model.extend({
	tableName: 'sponsors',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		organizationId: ['required', 'integer'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

module.exports = Sponsor;
