const bodyParser = require('body-parser');
const router = require('express').Router();

const EndpointAccessRequest = require('../requests/EndpointAccessRequest');
const middleware = require('../middleware');
const roles = require('../utils/roles');

const EndpointService = require('../services/EndpointService');

function modifyEndpointAccess(req, res, next) {
  EndpointService.modifyEndpointAccess(req.body.endpoint, req.body.enabled);

  res.body = req.body;

  return next();
}

function getEndpointAccess(req, res, next) {
  res.body = {};
  res.body.endpoint = req.query.endpoint;
  EndpointService.getEndpointAccess(req.query.endpoint,
    () => {
      res.body.enabled = true;
      next();
    }, 
    () => {
      res.body.enabled = false;
      next();
    }
  )
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(EndpointAccessRequest), middleware.permission(roles.ADMIN), modifyEndpointAccess);
router.get('/', middleware.permission(roles.ADMIN), getEndpointAccess);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
