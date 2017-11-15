const bodyParser = require('body-parser');
const router = require('express').Router();

const EndpointAccessRequest = require('../requests/EndpointAccessRequest');
const middleware = require('../middleware');
const roles = require('../utils/roles');

const cache = require('../../cache').instance();

function modifyEndpointAccess(req, res, next) {
  // Write enabled / disabled state to database
  cache.set(req.body.endpoint, req.body.enabled);

  // Test reading back the endpoint state
  // cache.get(req.body.endpoint, function(err, reply) {
  //   console.log(reply);
  // });

  next();
}


router.use(bodyParser.json());
// router.use(middleware.auth);

// router.post('/', middleware.request(EndpointAccessRequest), middleware.permission(roles.ADMIN), test);
router.post('/', middleware.request(EndpointAccessRequest), modifyEndpointAccess);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
