const errors = require('../errors');
const cache = require('../../cache').instance();

const Endpoint = require('../models/Endpoint');

const url = require('url');

const EndpointService = require('../services/EndpointService');

module.exports = (req, res, next) => {
  const endpointPath = url.parse(req.url).pathname;

  console.log('endpt is ' + endpointPath);

  EndpointService.getEndpointAccess(endpointPath,
    () => { 
      return next();
    }, 
    () => {
      return next(new errors.EndpointNotAvailableError());
    }
  );
};