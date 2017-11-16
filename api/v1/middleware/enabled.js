const errors = require('../errors');
const cache = require('../../cache').instance();

const url = require('url');

module.exports = (req, res, next) => {
  endpoint = url.parse(req.url).pathname;

  cache.get(endpoint, function(err, reply) {
    if (reply == null || reply == true) {
      return next();
    } else {
      return next(new errors.EndpointNotAvailableError());
    }
  });

};