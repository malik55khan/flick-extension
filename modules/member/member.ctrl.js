'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var serverMessages = require('./member.message');
var _ = require('lodash');
var validator = require("email-validator");

const Boom = require('boom');
var tribeServiceProvider = require('../flick-tribes/tribe.service');
var sharedService = require('../../shared/shared.service');
const getMyTribes = async (req, res, next) => {
  try {
    let memberId = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        isDeleted:false,
        'members.userId':memberId
      }
    };
    if(req.query.status){
      conditions.query.tribeActive = req.query.status == 'true' ? true : false;
    }
    let aggregate = sharedService.bindQuery(conditions);
    console.log(aggregate);
    let data = await tribeServiceProvider.getAll(aggregate);
    console.log(data)
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
        'members.userId':memberId
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
const getMyPosts= async (req, res, next) => {
  try {
    let memberId = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        'members.userId':memberId,
        "members.status" : "accepted"
      }
    };
    console.log('conditions.query',conditions.query)
    if(req.query.status){
      //conditions.query.tribeActive = req.query.status == 'true' ? true : false;
    }
    let aggregate = sharedService.bindQuery(conditions);
    console.log('aggregate',aggregate);
    let filteredPosts = [];
    let data = await tribeServiceProvider.getAll(aggregate,'created_at',-1);
    // let posts = await _.forEach(data,async (record,i)=>{
    //   await _.forEach(record.posts,async (post,j)=>{
    //     let boostActivity =  _.filter(post.boostActivity,(boostActivity)=>{
    //          return boostActivity.userId.toString() == req.access_token._id
    //     });
    //     if(boostActivity.length){
    //       post.tribeId = record._id;
    //       filteredPosts.push(post);
    //     }
    //   });
    // });
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
const getMyLikedPost = async (req, res, next) => {
  try {
    let userId = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        "isDeleted" : false
      }
    };
    let aggregate = sharedService.bindQuery(conditions);
    aggregate.push({$unwind:"$posts"});
    aggregate.push({$unwind:"$posts.boostActivity"});
    aggregate.push({$match:{"posts.boostActivity.userId":userId}},);
    let data = await tribeServiceProvider.getAll(aggregate,'created_at',-1);
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

const getTribe = async (req, res, next) => {
  try {
    let memberId = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        _id:ObjectId(req.params.tribeId)
        
      }
    };
    console.log(conditions);
    if(req.query.status){
      conditions.query.tribeActive = req.query.status == 'true' ? true : false;
    }
    let aggregate = sharedService.bindQuery(conditions);
    console.log(aggregate);
    let data = await tribeServiceProvider.getAll(aggregate,'tribeCreated',-1);
    console.log(data)
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
  getMyTribes:getMyTribes,
  getMemberPosts:getMemberPosts,
  getMyLikedPost:getMyLikedPost,
  getMyPosts:getMyPosts,
  getTribe:getTribe
};
