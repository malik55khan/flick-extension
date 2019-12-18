var express = require('express');
var router = express.Router();
var memberCtrl = require('./member.ctrl');
var jwt = require('../../config/jwToken');

//jwt.isAuthorizedToken,
router.route(`/:memberId/tribes`).get(jwt.isAuthorizedToken,memberCtrl.getMemberTribe); //- get a list of tribes that member belongs to
router.route(`/:memberId/posts`).get(memberCtrl.getMemberPosts); //- get a list of posts to boost 
router.route(`/tribes`).get(jwt.isAuthorizedToken,memberCtrl.getMyTribes); //- get a list of tribes that member belongs to
router.route(`/posts`).get(jwt.isAuthorizedToken,memberCtrl.getMyPosts); //- get a list of tribes that member belongs to
module.exports = router;
