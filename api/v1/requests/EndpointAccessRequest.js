const Request = require('./Request');

const bodyRequired = [ 'endpoint' ];
const bodyAllowed = [ 'enabled' ];
const bodyValidations = {
  'endpoint': ['required', 'string'],
  'enabled': [ 'boolean' ]
};

function EndpointAccessRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyAllowed = bodyAllowed;
  this.bodyValidations = bodyValidations;
}

EndpointAccessRequest.prototype = Object.create(Request.prototype);
EndpointAccessRequest.prototype.constructor = EndpointAccessRequest;

module.exports = EndpointAccessRequest;
