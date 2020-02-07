'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var serverMessages = require('./tribe.message');
var _ = require('lodash');
var validator = require("email-validator");
var notiService = require('../notification/notification.service');
const Boom = require('boom');
var tribeServiceProvider = require('./tribe.service');
var sharedService = require('../../shared/shared.service');
const userService = require('../user/user.service');
const path = require('path');
const createTribe = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    var body = req.body;
    console.log(body);
    if (_.isEmpty(body)) {
      isValidRequest = false;
      sharedService.setError('requestBody', 'Request body is empty');
    }
    if (_.isUndefined(body.tribeName) || _.isEmpty(body.tribeName)) {
      isValidRequest = false;
      sharedService.setError('tribeName', 'please enter Tribe name');
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
    body.tribeCreated = new Date();
    body.customerId = ObjectId(req.access_token._id);
    let tribe = await tribeServiceProvider.create(body);
    res.status(200)
      .json({
        code: 200,
        status: 'success',
        data: tribe,
        message: serverMessages.SUCCESS_ADDED
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const InviteMember = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    console.log(req.body)
    var body = req.body;
    if (_.isEmpty(body)) {
      isValidRequest = false;
      sharedService.setError('requestBody', 'Request body is empty');
    }
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    let conditions = {
      _id: ObjectId(req.params.tribeId)
    };
    let tribe = await tribeServiceProvider.getOne(conditions);
    let code = 200;
    let msg = "";
    let status = 'failure';
    body.invitedOn = new Date();
    body.status = "invited";
    let notification = {
      userId:ObjectId(body.userId),
      notification:"You have new invitation to join tribe "+tribe.tribeName
    }
    let isInvited = await tribeServiceProvider.getOne({_id:ObjectId(req.params.tribeId),"members.userId":ObjectId(req.body.userId)});
   
    let data = [];
    if(isInvited !=null){
      data = isInvited;
    }else{
      data = await tribeServiceProvider.addMember(conditions, body);
      await notiService.create(notification);
    }
    
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_ADDED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const inviteLink  = async (req,res) =>{
  var tribeId = req.params.tribeId;
  let tribe = await tribeServiceProvider.getOne({_id:ObjectId(tribeId)});
  console.log('tribe',tribe);
  let name = "Welcome to Flick";
  if(tribe){
    name = tribe.tribeName;
  }
  res.render('index.html',{tribe:name});
  //{ title: 'Welcome To Flick Extension',tribe:tribe }
}
const addPost = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;

    var body = req.body;
    if (_.isEmpty(body)) {
      isValidRequest = false;
      sharedService.setError('requestBody', 'Request body is empty');
    }
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    let conditions = {
      _id: ObjectId(req.params.tribeId)
    };

    let code = 200;
    let msg = "";
    let status = 'failure';

    let data = await tribeServiceProvider.addPost(conditions, body);
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_ADDED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const updatePost = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;

    var body = req.body;
    if (_.isEmpty(body)) {
      isValidRequest = false;
      sharedService.setError('requestBody', 'Request body is empty');
    }
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
    }
    if (_.isUndefined(req.params.postId) || _.isEmpty(req.params.postId)) {
      isValidRequest = false;
      sharedService.setError('postId', 'Post Id is missing in parametes');
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
    let conditions = {
      _id: ObjectId(req.params.tribeId)
    };
    conditions['posts'] = { $elemMatch: { "_id": ObjectId(req.params.postId) } };
    let code = 200;
    let msg = "";
    let status = 'failure';
    let postData = {};
    let SendNotification =  false;
    if (body.socialNetwork) {
      postData["posts.$.socialNetwork"] = body.socialNetwork;
    }
    if (body.postUrl) {
      postData["posts.$.postUrl"] = body.postUrl;
    }
    if (body.boostType) {
      postData["posts.$.boostType"] = body.boostType;
      SendNotification = true;
    }
    if (body.boostCampaignStarts) {
      postData["posts.$.boostCampaignStarts"] = body.boostCampaignStarts;
    }
    if (body.boostCampaignEnds) {
      postData["posts.$.boostCampaignEnds"] = body.boostCampaignEnds;
    }

    let data = await tribeServiceProvider.updatePost(conditions, postData);
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_UPDATED;
      if(SendNotification){
        
      }
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const deleteMembers = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    console.log(req.body)
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
    }
    if (_.isUndefined(req.body.membersIds) || _.isEmpty(req.body.membersIds)) {
      isValidRequest = false;
      sharedService.setError('body.ids', 'Member Ids is missing in body');
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
    let code = 200;
    let msg = "";
    let status = 'failure';
    let tribeId = ObjectId(req.params.tribeId);
    let data=null;
    let membersIds = req.body.membersIds.split('@');
    for(let i=0;i<membersIds.length;i++){
      data = await tribeServiceProvider.removeMember(tribeId, ObjectId(membersIds[i]));
    }
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_UPDATED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
};
const removeMember = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;

    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
    }
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
    let code = 200;
    let msg = "";
    let status = 'failure';

    let data = await tribeServiceProvider.removeMember(ObjectId(req.params.tribeId), ObjectId(req.params.memberId));
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_UPDATED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const acceptInvitition = async (req, res, next) => {
  try {
    
    sharedService.resetErrors();
    let isValidRequest = true;
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
    }
    let memberId = req.access_token._id;
    if (!isValidRequest) {
      return res
        .json({
          code: 204,
          status: 'failure',
          data: sharedService.getErrors(),
          message: serverMessages.ERROR_DEFAULT
        });
    }
    let conditions = {
      _id: ObjectId(req.params.tribeId)
    };
    conditions['members'] = { $elemMatch: { "userId": ObjectId(memberId) } };
    let code = 200;
    let msg = "";
    let status = 'failure';
    let postData = {};
    postData["members.$.status"] = "accepted";
    postData["members.$.joinedOn"] = new Date();
    

    let data = await tribeServiceProvider.updateMember(conditions, postData);
    let user = await userService.getOne({_id:ObjectId(memberId)});
    let notification = {
      userId:ObjectId(data.customerId),
      notification:user.name+" joined "+data.tribeName+" Tribe"
    }
    await notiService.create(notification);
    
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_UPDATED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const deleteTribe = async (req,res,next) =>{
  try{
    sharedService.resetErrors();
    let isValidRequest = true;

    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    let tribeId = ObjectId(req.params.tribeId);
    let data = await tribeServiceProvider.updateTribe({_id:tribeId},{isDeleted:true});
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_DELETE
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const removeMe = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;

    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    let code = 200;
    let msg = "";
    let status = 'failure';
    let memberId = ObjectId(req.access_token._id);
    let data = await tribeServiceProvider.removeMember(ObjectId(req.params.tribeId), memberId);
    if (data != null) {
      code = 204;
      status = 'success';
      msg = serverMessages.SUCCESS_ADDED;
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const getCustomerTribe = async (req, res) => {
  try {
    
    let conditions = {
      query : {
        customerId: ObjectId(req.access_token._id),
        isDeleted : false,
      }
    }
    let aggreate = sharedService.bindQuery(conditions);
    //aggreate.push({$project:{tribeName:1}});
    aggreate.push({$lookup: {"from": "users","localField": "members.userId","foreignField": "_id", "as": "members" } });
    var data = await tribeServiceProvider.getAll(aggreate);
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const getCustomerTribeById = async (req, res) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    console.log(req.params);  
    let conditions = {
      query : {
        customerId: ObjectId(req.access_token._id),
        _id: ObjectId(req.params.tribeId)
      }
    }
    var data = await tribeServiceProvider.getAll(sharedService.bindQuery(conditions));
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const getCustomerTribeMembers = async (req, res) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
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
    
    let conditions = {
      query : {
        customerId: ObjectId(req.access_token._id),
        _id: ObjectId(req.params.tribeId)
      }
    }
    if(req.query.status){
      conditions.query.status = req.query.status; 
    }
    var data = await tribeServiceProvider.getAll(sharedService.bindQuery(conditions),{members:1});
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const likePost = async (req, res, next) => {
  try {
    sharedService.resetErrors();
    let isValidRequest = true;

    var body = req.body;
    if (_.isEmpty(body)) {
      isValidRequest = false;
      sharedService.setError('requestBody', 'Request body is empty');
    }
    if (_.isUndefined(req.params.tribeId) || _.isEmpty(req.params.tribeId)) {
      isValidRequest = false;
      sharedService.setError('tribeId', 'Tribe Id is missing in parametes');
    }
    if (_.isUndefined(req.params.postId) || _.isEmpty(req.params.postId)) {
      isValidRequest = false;
      sharedService.setError('postId', 'Post Id is missing in parametes');
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
    let conditions = {
      _id: ObjectId(req.params.tribeId)
    };
    conditions['posts'] = { $elemMatch: { "_id": ObjectId(req.params.postId) } };
    let code = 200;
    let msg = "";
    let status = 'failure';
    let postData = {};
    body.date = new Date();
    postData["posts.$.boostActivity"] = body;  

    let data = await tribeServiceProvider.updatePostByPush(conditions, postData);
    if (data != null) {
      code = 200;
      status = 'success';
      msg = serverMessages.SUCCESS_UPDATED;
      await notiService.create({
        userId:data.customerId,
        notification:"Your post from "+data.tribeName+" Tribe has been like."
      });
    } else {
      code = 204;
      msg = serverMessages.ERROR_DEFAULT;
    }


    res.status(200)
      .json({
        code: code,
        status: status,
        data: data,
        message: msg
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}
const updateTribe = async (req,res)=>{
  try{
    let body = req.body;
    let conditions = {
      _id:ObjectId(req.params.tribeId),
    };
    
    let data = await tribeServiceProvider.updateTribe(conditions,body);
    res.status(200)
      .json({
        code: 200,
        status: 'success',
        data: data,
        message: serverMessages.SUCCESS_UPDATED
      });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
const getTribe = async (req, res) => {
  try {
    
    let conditions = {
      query : {
        _id: ObjectId(req.params.tribeId),
      }
    }
    let aggreate = sharedService.bindQuery(conditions);
    //aggreate.push({$project:{tribeName:1}});
    aggreate.push({$lookup: {"from": "users","localField": "members.userId","foreignField": "_id", "as": "members" } });
    var data = await tribeServiceProvider.getAll(aggreate);
    res.status(200)
      .json({
        code: 200,
        status: "success",
        data: data,
        message: serverMessages.SUCCESS_FOUND
      });
  } catch (err) {
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}
module.exports = {
  createTribe: createTribe,
  updateTribe: updateTribe,
  getCustomerTribe: getCustomerTribe,
  getTribe: getTribe,
  getCustomerTribeMembers:getCustomerTribeMembers,
  getCustomerTribeById: getCustomerTribeById,
  InviteMember: InviteMember,
  addPost: addPost,
  updatePost: updatePost,
  removeMember: removeMember,
  deleteMembers:deleteMembers,
  removeMe: removeMe,
  deleteTribe:deleteTribe,
  acceptInvitition: acceptInvitition,
  inviteLink:inviteLink,
  likePost:likePost
};
