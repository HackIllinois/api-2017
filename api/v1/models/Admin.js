/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Admin = Model.extend({
	tableName: 'admins',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

module.exports = Admin;
