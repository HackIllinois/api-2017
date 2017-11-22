const errors = require('../errors');
const cache = require('../../cache').instance();

const Endpoint = require('../models/Endpoint');

const url = require('url');

module.exports = (req, res, next) => {
  endpoint = url.parse(req.url).pathname;

  // cache.get(endpoint, function(err, reply) {
  //   if (reply == null || reply == 'true') {
  //     return next();
  //   } else {
  //     return next(new errors.EndpointNotAvailableError());
  //   }
  // });

  Endpoint.query({where: {endpoint: req.url}}).fetch().then(function (endpointModel) {
    if (endpointModel == null || endpointModel.attributes.enabled[0] == 1) {
      return next();
    } else {
      return next(new errors.EndpointNotAvailableError());
    }
  });

};