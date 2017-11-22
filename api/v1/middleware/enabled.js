const errors = require('../errors');
const cache = require('../../cache').instance();

const Endpoint = require('../models/Endpoint');

const url = require('url');

module.exports = (req, res, next) => {
  endpointPath = url.parse(req.url).pathname; // eslint-disable-line no-undef

  cache.get(endpointPath, (err, reply) => { // eslint-disable-line no-undef
    if (reply == 'true') {
      return next();
    } else if (reply == 'false') {
      return next(new errors.EndpointNotAvailableError());
    } 
    Endpoint.query({where: {endpoint: endpointPath}}).fetch().then((endpointModel) => { // eslint-disable-line no-undef
      if (endpointModel == null || endpointModel.attributes.enabled[0] == 1) {
        cache.set(endpointPath, 'true'); // eslint-disable-line no-undef
        return next();
      } 
      cache.set(endpointPath, 'false'); // eslint-disable-line no-undef
      return next(new errors.EndpointNotAvailableError());
        
    });
    
  });

};