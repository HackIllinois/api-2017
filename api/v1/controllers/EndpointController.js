const bodyParser = require('body-parser');
const router = require('express').Router();

const EndpointAccessRequest = require('../requests/EndpointAccessRequest');
const middleware = require('../middleware');
const roles = require('../utils/roles');

const Endpoint = require('../models/Endpoint');

const cache = require('../../cache').instance();

const logger = require('../../logging');

function modifyEndpointAccess(req, res, next) {
  // Write enabled / disabled state to cache
  cache.set(req.body.endpoint, req.body.enabled);

  // Write enabled / disabled state to databas
  Endpoint.query({where: {endpoint: req.body.endpoint}}).fetch().then((endpointModel) => {
    const methodType = ((endpointModel == null) ? 'insert' : 'update');
    Endpoint.forge({
      endpoint: req.body.endpoint,
      enabled: req.body.enabled
    }).save(null, {method: methodType});
  });
  res.body = req.body;

  // Log the endpoint access change here
  logger.debug('Endpoint Access Changed: %s is %s.',
    req.body.endpoint,
    req.body.enabled ? "enabled" : "disabled"
  );

  return next();
}

function getEndpointAccess(req, res, next) {
  res.body = {};
  res.body.endpoint = req.query.endpoint;
  cache.get(req.query.endpoint, (err, reply) => {
    if (reply != null) {
      res.body.enabled = (reply == 'true');
      return next();
    } 
    Endpoint.query({where: {endpoint: res.body.endpoint}}).fetch().then((endpointModel) => {
      if (endpointModel == null || endpointModel.attributes.enabled[0] == 1) {
        cache.set(req.query.endpoint, 'true');
        res.body.enabled = true;
        return next();
      } 
      cache.set(req.query.endpoint, 'false');
      res.body.enabled = false;
      return next();
        
    });
    
  });
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(EndpointAccessRequest), middleware.permission(roles.ADMIN), modifyEndpointAccess);
router.get('/', middleware.permission(roles.ADMIN), getEndpointAccess);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
