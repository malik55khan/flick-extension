/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken
 */

var jwt = require('jsonwebtoken');
var CONFIG = require('../config/index');
// Generates a token from supplied payload
module.exports.issueToken = function(payload) {
  return jwt.sign(
    payload,
    CONFIG.jwtSecret, // Token Secret that we sign it with
    {
      expiresIn: '7d', //3600 in minutes // Token Expire time //7d
    }
  );
};

// Verifies token on a request
function verifyToken (token, callback) {
  return jwt.verify(
    token, // The token to be verified
    CONFIG.jwtSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};

module.exports.isAuthorizedToken = function(req, res, next) {
    var token;
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (/^JWT/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return res.json(401, {err: 'No Authorization header was found'}); //iinvalid format
      }
    }else {
      return res.json(401, {err: 'No Authorization header was found'});
    }

    verifyToken(token, function (err, token) {
      if (err) return res.json(401, {err: 'Invalid Token!'});
      req.access_token = token; // This is the decrypted token or the payload you provided
      next();
    });
};