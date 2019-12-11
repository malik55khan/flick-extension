'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var serverMessages = require('./member.message');
var _ = require('lodash');
var validator = require("email-validator");

const Boom = require('boom');
var tribeServiceProvider = require('../tribe/tribe.service');
var sharedService = require('../../shared/shared.service');
const getMemberTribe = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    if (_.isUndefined(req.params.memberId) || _.isEmpty(req.params.memberId)) {
      isValidRequest = false;
      sharedService.setError('memberId', 'Member Id is missing in parametes');
    }

    if (!isValidRequest) {
      return res
        .json({
          code: 204,
          status: 'failure',
          data: sharedService.getErrors(),
          message: serverMessages.ERROR_DEFAULT
        });
    }
    let memberId = ObjectId(req.params.memberId);
    let conditions = {
      query:{
        'members._id':memberId
      }
    };
    if(req.query.status){
      conditions.query.tribeActive = req.query.status == 'true' ? true : false;
    }
    let aggregate = sharedService.bindQuery(conditions);
    console.log(aggregate);
    let data = await tribeServiceProvider.getAll(aggregate);
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const getMemberPosts = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    if (_.isUndefined(req.params.memberId) || _.isEmpty(req.params.memberId)) {
      isValidRequest = false;
      sharedService.setError('memberId', 'Member Id is missing in parametes');
    }

    if (!isValidRequest) {
      return res
        .json({
          code: 204,
          status: 'failure',
          data: sharedService.getErrors(),
          message: serverMessages.ERROR_DEFAULT
        });
    }
    let memberId = ObjectId(req.params.memberId);
    let conditions = {
      query:{
        'posts.boostActivity.userId':memberId
      }
    };
    if(req.query.status){
      //conditions.query.tribeActive = req.query.status == 'true' ? true : false;
    }
    let aggregate = sharedService.bindQuery(conditions);
    console.log(aggregate);
    let data = await tribeServiceProvider.getAll(aggregate);
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
module.exports = {
  getMemberTribe: getMemberTribe,
  getMemberPosts:getMemberPosts
};
