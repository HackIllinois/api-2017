const _Promise = require('bluebird');
const UserService = require('../services/UserService');
const User = require('../models/User');
const request = require('request-promise');
const StatusCodeError = require('request-promise/errors').StatusCodeError;

const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require('../../config');
const errors = require('../errors');

const JWT_SECRET = config.auth.secret;
const JWT_CONFIG = {
  expiresIn: config.auth.expiration
};

const GITHUB_AUTH_REDIRECT = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAIL_URL = 'https://api.github.com/user/emails';

/**
 * Issues an auth token using the provided payload and optional subject
 * @param  {Object} payload the content to claim in the token
 * @param  {String} subject the subject of the claim (optional, but recommended)
 * @return {String} an auth token representing a claim, expiring as defined
 * in the global configuration
 * @throws see JWT error documentation for possible errors
 */
function _issue(payload, subject) {
  const parameters = _.clone(JWT_CONFIG);
  if (arguments.length > 1) {
    parameters.subject = subject;
  }
  return jwt.sign(payload, JWT_SECRET, parameters);
}

/**
 * Issues a token for the parameterized user
 * @param  {User} user the User model holding the information to claim
 * @return {Promise} resolving to the auth token
 */
module.exports.issueForUser = (user) => {
  const subject = user.get('id').toString();
  const payload = {
    email: user.get('email'),
    roles: user.related('roles').toJSON()
  };
  return _Promise.try(() =>
    // the JWT library behind _issue may thrown any number
    // of errors, which we do not want to propogate yet
    _Promise.resolve(_issue(payload, subject)));
};

/**
 * Verifies the parameterized token's signature and expiration
 * @param  {String} token an auth token
 * @return {Promise} resolving to the validity of the token, or a rejected
 * promise resolving to an UnprocessableRequestError
 */
module.exports.verify = (token) => _Promise.try(() =>
    _Promise.resolve(jwt.verify(token, JWT_SECRET))
  )
  .catch(jwt.JsonWebTokenError, (error) => {
    const message = error.message;
    throw new errors.UnprocessableRequestError(message);
  });

module.exports.getGitHubSessionCodeURL = (nativeClient) => GITHUB_AUTH_REDIRECT + (nativeClient ? config.auth.github.native.id : config.auth.github.web.id);

module.exports.requestGitHubAccessToken = (code, nativeClient) => {
  let token;
  let githubHandle;

  return request({
    uri: GITHUB_TOKEN_URL,
    qs: {
      client_id: (nativeClient) ? config.auth.github.native.id : config.auth.github.web.id,
      client_secret: (nativeClient) ? config.auth.github.native.secret : config.auth.github.web.secret,
      code: code
    },
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((body) => {
      token = JSON.parse(body).access_token;
      return module.exports.getGitHubAccountDetails(token);
    })
    .then((handle) => {
      githubHandle = handle;
      return User.findByGitHubHandle(handle);
    })
    .then((user) => {
      if (_.isNull(user)) {
        return module.exports.getGitHubAccountEmail(token)
          .then((email) => UserService.createGitHubUser(email, githubHandle))
          .then(() => token);
      }
      return token;
    });
};

module.exports.getGitHubAccountDetails = (authToken) => request({
  uri: GITHUB_USER_URL,
  qs: {
    access_token: authToken
  },
  headers: {
    'User-Agent': config.auth.github.useragent
  },
  json: true
})
  .then((account) => account.login)
  .catch(StatusCodeError, (error) => {
    const message = 'The request failed with reason (' + error.message + ')';
    const source = GITHUB_USER_URL;

    throw new errors.UnprocessableRequestError(message, source);
  });

module.exports.getGitHubAccountEmail = (authToken) => request({
  uri: GITHUB_EMAIL_URL,
  qs: {
    access_token: authToken
  },
  headers: {
    'User-Agent': config.auth.github.useragent
  },
  json: true
})
  .then((body) => {
    const primaryEmail = _.find(body, 'primary').email;
    if (_.isUndefined(primaryEmail)) {
      const message = 'The GitHub account has no primary email';
      throw new errors.UnprocessableRequestError(message);
    }

    return primaryEmail;
  })
  .catch(StatusCodeError, (error) => {
    const message = 'The request failed with reason (' + error.message + ')';
    const source = GITHUB_USER_URL;

    throw new errors.UnprocessableRequestError(message, source);
  });
