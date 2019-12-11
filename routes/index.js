const express = require('express');
const userRoute = require('../modules/user/user.route');
const tribeRoute = require('../modules/tribe/tribe.route');
const memberRoute = require('../modules/member/member.route');
module.exports = function (app) {
 
  const router = express.Router();
  router.use(`/users`, userRoute);
  router.use(`/tribes`,tribeRoute);
  router.use(`/members`,memberRoute);
  app.use(`/api`, router);
  
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'API running successfully',
      data: null
    });
  });
};