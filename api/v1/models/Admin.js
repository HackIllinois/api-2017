/* jshint esversion: 6 */

var registration = require('../utils/registration');
var _ = require('lodash');

var OMITTED_ATTRIBUTES = [];

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

/**
 * Serializes this Admin
 * @return {Object} the serialized form of this Admin
 */
Admin.prototype.toJSON = function () {
	return _.omit(this.attributes, OMITTED_ATTRIBUTES);
};

module.exports = Admin;
