var express = require('express');
var router = express.Router();
var memberCtrl = require('./member.ctrl');
var jwt = require('../../config/jwToken');

//jwt.isAuthorizedToken,
router.route(`/:memberId/tribes`).get(memberCtrl.getMemberTribe); //- get a list of tribes that member belongs to
router.route(`/:memberId/posts`).get(memberCtrl.getMemberPosts); //- get a list of posts to boost 
module.exports = router;
