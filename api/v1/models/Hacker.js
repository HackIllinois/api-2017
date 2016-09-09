/* jshint esversion: 6 */

var utils = require('../utils');
var registration = utils.registration;
var _ = require('lodash');

var OMITTED_ATTRIBUTES = [];

var Model = require('./Model');
var Upload = require('./Upload');
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
	},
	submissionValidations: {
		userId: ['required', 'integer'],
		age: ['required', 'number', 'max:100', 'min:13'],
		gender: ['required', 'string', registration.verifyGender],
		school: ['required', 'string', 'maxLength:255'],
		graduationYear: ['required', 'number', 'between:2016:2021'],
		major: ['required', 'string', 'maxLength:255'],
		diet: ['required', 'string', registration.verifyDiet],
		professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
		linkedinUrl: ['url', 'maxLength:255'],
		githubUrl: ['url', 'maxLength:255'],
		siteUrl: ['url', 'maxLength:255'],
	  hackathonAttendance: ['required', 'string', registration.verifyHackathonAttendance],
	  //Assuming initiatives will be passed as an array of strings
	  initiatives: ['required', 'array', registration.verifyInitiatives],
	  hardwareDesired: ['string', 'maxLength:255'],
	  openSourceInterests: ['string', 'maxLength:255'],
	  extraInformation: ['string', 'maxLength:255'],
		tshirtSize: ['required', 'string', registration.verifyTshirtSize]
	}
});

/**
 * Serializes this Hacker
 * @return {Object} the serialized form of this Hacker
 */
Hacker.prototype.toJSON = function () {
	var registration = _.omit(this.attributes, OMITTED_ATTRIBUTES);
	registration.resume = this.getResume();
	return registration;
};
/**
 * Validates this Hacker's submitted registration
 * @return {Promise} resolving to the validity of the attributes, as decided by
 * the Checkit library
 */
Hacker.prototype.validateSubmission(){
		return checkit(this.submissionValidations).run(this.attributes);
}

/**
 * Gets this Hacker's resume Upload object
 * @return {Object} the Upload object
 */
Hacker.prototype.getResume = function () {
	return Upload.findByOwner(new User({id: this.attributes.userId}), utils.storage.buckets.resumes);
};

module.exports = Hacker;
