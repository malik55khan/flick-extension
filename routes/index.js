const express = require('express');
const userRoute = require('../modules/user-profiles/user.route');
const tribeRoute = require('../modules/flick-tribes/tribe.route');
const memberRoute = require('../modules/member/member.route');
const tribeCtrl = require('../modules/flick-tribes/tribe.ctrl');
const notificationRoute = require('../modules/flick-notifications/notification.route');
module.exports = function (app) {
 
  const router = express.Router();
  router.use(`/users`, userRoute);
  router.use(`/tribes`,tribeRoute);
  router.use(`/members`,memberRoute);
  router.use(`/notifications`,notificationRoute);
  app.use(`/api`, router);
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'API running successfully',
      data: null
    });
  });
  app.get('/invite/tribe/:tribeId',tribeCtrl.inviteLink);
};