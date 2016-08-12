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

/**
 * Serializes this Volunteer
 * @return {Object} the serialized form of this Volunteer
 */
Volunteer.prototype.toJSON = function () {
	return _.omit(this.attributes, ['userId']);
};

module.exports = Volunteer;
