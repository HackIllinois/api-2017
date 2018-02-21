const ApiError = require('./ApiError');

const ERROR_TYPE = 'EndpointNotAvailableError';
const ERROR_TITLE = 'Endpoint Not Available';
const STATUS_CODE = 400;

const DEFAULT_MESSAGE = 'This endpoint has been disabled';

function EndpointNotAvailableError(message, source) {
  ApiError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.status = STATUS_CODE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : null;
}

EndpointNotAvailableError.prototype = Object.create(ApiError.prototype);
EndpointNotAvailableError.prototype.constructor = EndpointNotAvailableError;

module.exports = EndpointNotAvailableError;
