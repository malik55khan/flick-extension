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
      }
    };
    
    let aggregate = sharedService.bindQuery(conditions);
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
module.exports = {
  getMyNotifications: getMyNotifications,
  create:create
};
