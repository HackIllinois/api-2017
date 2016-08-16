/* jshint esversion: 6 */

var registration = require('../utils/registration');
var _ = require('lodash');

var OMITTED_ATTRIBUTES = [];

var Model = require('./Model');
var Hacker = Model.extend({
	tableName: 'hackers',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		age: ['number', 'max:100', 'min:13'],
		gender: ['string', registration.verifyGender],
		school: ['string', 'maxLength:255'],
		graduationYear: ['number', 'between:2016:2021'],
		major: ['string', 'maxLength:255'],
		diet: ['string', registration.verifyDiet],
		professionalInterest: ['string', registration.verifyProfessionalInterest],
		linkedinUrl: ['url', 'maxLength:255'],
		githubUrl: ['url', 'maxLength:255'],
		siteUrl: ['url', 'maxLength:255'],
	  hackathonAttendance: ['string', registration.verifyHackathonAttendance],
	  //Assuming initiatives will be passed as an array of strings
	  initiatives: ['array', registration.verifyInitiatives],
	  hardwareDesired: ['string', 'maxLength:255'],
	  openSourceInterests: ['string', 'maxLength:255'],
	  extraInformation: ['string', 'maxLength:255'],
		tshirtSize: ['string', registration.verifyTshirtSize]
	}
});

/**
 * Serializes this Hacker
 * @return {Object} the serialized form of this Hacker
 */
Hacker.prototype.toJSON = function () {
	return _.omit(this.attributes, OMITTED_ATTRIBUTES);
};

module.exports = Hacker;
