const bodyParser = require('body-parser');
const router = require('express').Router();

const EndpointAccessRequest = require('../requests/EndpointAccessRequest');
const middleware = require('../middleware');
// const roles = require('../utils/roles');

const Endpoint = require('../models/Endpoint');

// const cache = require('../../cache').instance();

function modifyEndpointAccess(req, res, next) {

  if (req.body.enabled == null) {
    res.body = {};
    res.body.endpoint = req.body.endpoint;
    Endpoint.query({where: {endpoint: req.body.endpoint}}).fetch().then((endpointModel) => {
      res.body.enabled = (endpointModel == null || endpointModel.attributes.enabled[0] == 1);
      return next();
    });
  } else {
    // Write enabled / disabled state to cache
    // cache.set(req.body.endpoint, req.body.enabled);

    // Write enabled / disabled state to databas
    Endpoint.query({where: {endpoint: req.body.endpoint}}).fetch().then((endpointModel) => {
      methodType = ((endpointModel == null) ? 'insert' : 'update');
      Endpoint.forge({
        endpoint: req.body.endpoint,
        enabled: req.body.enabled
      }).save(null, {method: methodType});
    });
    res.body = req.body;
    return next();
  }
}


router.use(bodyParser.json());
// router.use(middleware.auth);

// router.post('/', middleware.request(EndpointAccessRequest), middleware.permission(roles.ADMIN), test);
router.post('/', middleware.request(EndpointAccessRequest), modifyEndpointAccess);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
