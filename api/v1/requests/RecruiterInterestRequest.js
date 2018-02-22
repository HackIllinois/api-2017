const Request = require('./Request');

const bodyRequired = ['attendeeUserId'];
const bodyAllowed = ['comments', 'favorite'];
const bodyValidations = {
  'attendeeUserId': ['required', 'integer'],
  'comments': ['string', 'maxLength:255'],
  'favorite': ['boolean']
};

function RecruiterInterestRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
  this.bodyAllowed = bodyAllowed;
}

RecruiterInterestRequest.prototype = Object.create(Request.prototype);
RecruiterInterestRequest.prototype.constructor = RecruiterInterestRequest;

module.exports = RecruiterInterestRequest;
