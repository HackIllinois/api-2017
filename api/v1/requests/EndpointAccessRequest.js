const Request = require('./Request');

const bodyRequired = ['endpoint', 'enabled'];
const bodyValidations = {
  'endpoint': ['required', 'string'],
  'enabled': ['required', 'boolean']
};

function EndpointAccessRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

EndpointAccessRequest.prototype = Object.create(Request.prototype);
EndpointAccessRequest.prototype.constructor = EndpointAccessRequest;

module.exports = EndpointAccessRequest;
