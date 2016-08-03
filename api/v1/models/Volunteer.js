/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Volunteer = Model.extend({
	tableName: 'volunteers',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

module.exports = Volunteer;
