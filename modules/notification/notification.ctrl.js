'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var serverMessages = require('./notification.message');
var _ = require('lodash');
const Boom = require('boom');
var notiServiceProvider = require('../notification/notification.service');
var sharedService = require('../../shared/shared.service');
const getMyNotifications = async (req, res, next) => {
  try {
    let id = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        'userId':id
      },
      limit:20,
      offSet:1
    };
    
    let aggregate = sharedService.bindQuery(conditions,'created_at',-1);
    console.log(aggregate);
    let data = await notiServiceProvider.getAll(aggregate);
    
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
const getMyPendingNotifications = async (req, res, next) => {
  try {
    let id = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        'userId':id,
        "isNotify":false
      }
    };
    
    let aggregate = sharedService.bindQuery(conditions,'created_at');
    console.log(aggregate);
    let data = await notiServiceProvider.getAll(aggregate);
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
const getMyUnreadNotifications = async (req, res, next) => {
  try {
    let id = ObjectId(req.access_token._id);
    let conditions = {
      query:{
        'userId':id,
        "isRead":false
      }
    };
    
    let aggregate = sharedService.bindQuery(conditions);
    let data = await notiServiceProvider.getAll(aggregate);
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data.length,
        message: serverMessages.SUCCESS_FOUND
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const create = async (req,res)=>{
  try{
    let body = req.body;
    body.userId = ObjectId(req.access_token._id);
    let notification = await notiServiceProvider.create(body);
    res.status(200)
      .json({
        code: 200,
        status: 'success',
        data: notification,
        message: serverMessages.SUCCESS_ADDED
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const update = async (req,res)=>{
  try{
    let body = req.body;
    let conditions = {
      _id:ObjectId(req.params.id),
      
    };
    
    let notification = await notiServiceProvider.update(conditions,body);
    res.status(200)
      .json({
        code: 200,
        status: 'success',
        data: notification,
        message: serverMessages.SUCCESS_UPDATED
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const updateAll = async (req,res)=>{
  try{
    let body = req.body;
    let conditions = {
      userId:ObjectId(req.access_token._id),
    };
    let notification = await notiServiceProvider.update(conditions,body);
    res.status(200)
      .json({
        code: 200,
        status: 'success',
        data: notification,
        message: serverMessages.SUCCESS_UPDATED
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
module.exports = {
  getMyNotifications: getMyNotifications,
  create:create,
  update:update,
  updateAll:updateAll,
  getMyUnreadNotifications:getMyUnreadNotifications,
  getMyPendingNotifications:getMyPendingNotifications
};
