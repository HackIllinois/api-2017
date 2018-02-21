const Endpoint = require('../models/Endpoint');

const cache = require('../../cache').instance();

const logger = require('../../logging');

function modifyEndpointAccess(reqEndpoint, reqEnabled) {
	// Write enabled / disabled state to database
  Endpoint.query({where: {endpoint: reqEndpoint}}).fetch().then((endpointModel) => {
    const methodType = ((endpointModel == null) ? 'insert' : 'update');
    Endpoint.forge({
      endpoint: reqEndpoint,
      enabled: reqEnabled
    }).save(null, {method: methodType});
    // Write enabled / disabled state to cache
    cache.set(reqEndpoint, reqEnabled);
  });

  // Log the endpoint access change here
  logger.debug('EndpointStateChanged: %s is %s.',
    reqEndpoint,
    reqEnabled ? 'enabled' : 'disabled'
  );
}

function getEndpointAccess(reqEndpoint, onEnabled, onDisabled) {
  return cache.get(reqEndpoint, (err, reply) => {
    console.log('reply is ' + reply);
    if (reply == 'true') {
      onEnabled();
      return;
    } else if (reply == 'false') {
      console.log('good');
      onDisabled();
      return;
    }
    Endpoint.query({where: {endpoint: reqEndpoint}}).fetch().then((endpointModel) => {
      if (endpointModel == null || endpointModel.attributes.enabled[0] == 1) {
        cache.set(reqEndpoint, 'true');
        onEnabled();
        return;
      } 
      cache.set(reqEndpoint, 'false');
      onDisabled();
      return;
    });
  });
}

module.exports.modifyEndpointAccess = modifyEndpointAccess;
module.exports.getEndpointAccess = getEndpointAccess;
