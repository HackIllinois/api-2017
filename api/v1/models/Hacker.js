/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Hacker = Model.extend({
	tableName: 'hackers',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer'],
		age: ['number', 'max:100', 'min:13'],
		gender: ['string', registration.verifyGender],
		school: ['string', 'maxLength:256'],
		graduationYear: ['number', 'max:2020', 'min:2017'],
		major: ['string', 'maxLength:256'],
		diet: ['string', registration.verifyDiet],
		professionalInterest: ['string', registration.verifyProfessionalInterest],
		linkedinUrl: ['url', 'maxLength:256'],
		githubUrl: ['url', 'maxLength:256'],
		siteUrl: ['url', 'maxLength:256'],
	  hackathonAttendance: ['string', registration.verifyHackathonAttendance],
	  //Assuming initiatives will be passed as an array of strings
	  initiatives: ['array', registration.verifyInitiatives],
	  hardwareDesired: ['string', 'maxLength:256'],
	  openSourceInterests: ['string', 'maxLength:256'],
	  extraInformation: ['string', 'maxLength:256'],
		tshirtSize: ['string', registration.verifyTshirtSize]
	}
});

/**
 * Serializes this Hacker
 * @return {Object} the serialized form of this Hacker
 */
Hacker.prototype.toJSON = function () {
	return _.omit(this.attributes, ['userId']);
};

module.exports = Hacker;
