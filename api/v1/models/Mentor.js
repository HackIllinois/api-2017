/* jshint esversion: 6 */

var registration = require('../utils/registration');
var _ = require('lodash');

var OMITTED_ATTRIBUTES = [];

var Model = require('./Model');
var Mentor = Model.extend({
	tableName: 'mentors',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		organizationId: ['required', 'integer'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

/**
 * Serializes this Mentor
 * @return {Object} the serialized form of this Mentor
 */
Mentor.prototype.toJSON = function () {
	return _.omit(this.attributes, OMITTED_ATTRIBUTES);
};

module.exports = Mentor;
