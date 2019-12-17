const express = require('express');
const userRoute = require('../modules/user/user.route');
const tribeRoute = require('../modules/tribe/tribe.route');
const memberRoute = require('../modules/member/member.route');
const tribeCtrl = require('../modules/tribe/tribe.ctrl');
module.exports = function (app) {
 
  const router = express.Router();
  router.use(`/users`, userRoute);
  router.use(`/tribes`,tribeRoute);
  router.use(`/members`,memberRoute);
  app.use(`/api`, router);
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'API running successfully',
      data: null
    });
  });
  app.get('/invit/tribe/:tribeId',tribeCtrl.inviteLink);
};