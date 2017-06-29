const UnprocessableRequestError = require('./UnprocessableRequestError.js');

const ERROR_TYPE = 'InvalidTrackingStateError';
const ERROR_TITLE = 'Invalid Tracking State';
const DEFAULT_MESSAGE = 'An error occurred with the current state of the event tracking system';

function TrackingInProgressError(message, source) {
  UnprocessableRequestError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : null;
}

TrackingInProgressError.prototype = Object.create(UnprocessableRequestError.prototype);
TrackingInProgressError.prototype.constructor = TrackingInProgressError;

module.exports = TrackingInProgressError;
