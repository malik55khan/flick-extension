var express = require('express');
var router = express.Router();
var ctrl = require('./notification.ctrl');
var jwt = require('../../config/jwToken');
router.route(`/`).post(jwt.isAuthorizedToken,ctrl.create);
router.route(`/`).get(jwt.isAuthorizedToken,ctrl.getMyNotifications); //- get a list of tribes that member belongs to
module.exports = router;