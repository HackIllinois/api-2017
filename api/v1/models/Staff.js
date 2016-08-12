/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Staff = Model.extend({
	tableName: 'staff',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

/**
 * Serializes this Staff
 * @return {Object} the serialized form of this Staff
 */
Staff.prototype.toJSON = function () {
	return _.omit(this.attributes, ['userId']);
};

module.exports = Staff;
