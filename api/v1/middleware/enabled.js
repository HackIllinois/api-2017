const errors = require('../errors');
const cache = require('../../cache').instance();

const Endpoint = require('../models/Endpoint');

const url = require('url');

module.exports = (req, res, next) => {
  const endpointPath = url.parse(req.url).pathname;

  cache.get(endpointPath, (err, reply) => {
    if (reply == 'true') {
      return next();
    } else if (reply == 'false') {
      return next(new errors.EndpointNotAvailableError());
    } 
    Endpoint.query({where: {endpoint: endpointPath}}).fetch().then((endpointModel) => {
      if (endpointModel == null || endpointModel.attributes.enabled[0] == 1) {
        cache.set(endpointPath, 'true');
        return next();
      } 
      cache.set(endpointPath, 'false');
      return next(new errors.EndpointNotAvailableError());
        
    });
    
  });

};