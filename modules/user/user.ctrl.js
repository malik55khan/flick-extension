'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var serverMessages = require('./user.message');
var _ = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var CONFIG = require('../../config/index');
const Boom = require('boom');
var userServiceProvider = require('./user.service');
var sharedService = require('../../shared/shared.service');
const register = async(req, res, next) => {
  try{
    sharedService.resetErrors();
    let isValidRequest = true;
    
    var body = req.body;
    if(_.isEmpty(body)){
      isValidRequest = false;
      sharedService.setError('requestBody','Request body is empty');
    }
    if(_.isUndefined(body.name) || _.isEmpty(body.name)){
      isValidRequest = false;
      sharedService.setError('name','please enter your name');
    }
    body.email = (body.email).toLowerCase();
    if(_.isUndefined(body.email) || _.isEmpty(body.email)){
      isValidRequest = false;
      sharedService.setError('email','please enter your email');
    }
    if(_.isUndefined(body.password) || _.isEmpty(body.password)){
      isValidRequest = false;
      sharedService.setError('password','please enter your password');
    }
    if(_.isUndefined(body.vatNumber) || _.isEmpty(body.vatNumber)){
      isValidRequest = false;
      sharedService.setError('vatNumber','please enter your vat number');
    }
    if(_.isUndefined(body.role) || _.isEmpty(body.role)){
      isValidRequest = false;
      sharedService.setError('role','please enter your user role');
    }
    if(!isValidRequest){
      return res
      .json({
        code:204,
        status: 'failure',
        data: sharedService.getErrors(),
        message: serverMessages.ERROR_GET_USERDATA
      });
    }
    let user = await userServiceProvider.create(body);
    res.status(200)
        .json({
          code:200,
          status: 'success',
          data: user,
          message: serverMessages.SUCCESS_REGISTER
        });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
}


const login = async (req, res, next) => {
  try{
    sharedService.resetErrors();
    let isValidRequest = true;
    
    var body = req.body;
    if(_.isEmpty(body)){
      isValidRequest = false;
      sharedService.setError('requestBody','Request body is empty');
    }
    
    if(_.isUndefined(body.email) || _.isEmpty(body.email)){
      isValidRequest = false;
      sharedService.setError('email','please enter your email');
    }
    if (!_.isUndefined(body.email) && !validator.validate(body.email)) {
      isValidRequest = false;
      sharedService.setError('email','please enter a valid email');
    }
    if(_.isUndefined(body.password) || _.isEmpty(body.password)){
      isValidRequest = false;
      sharedService.setError('password','please enter your password');
    }
    if(!isValidRequest){
      return res
      .json({
        code:204,
        status: 'failure',
        data: sharedService.getErrors(),
        message: serverMessages.ERROR_GET_USERDATA
      });
    }
    let code =200;
    let msg = "";
    let status = 'failure';
    body.email = (body.email).toLowerCase();
    let user = await userServiceProvider.getOne({email:body.email},{salt:1});
    if(!_.isEmpty(user)){
      var password = crypto.pbkdf2Sync(body.password, user.salt, 1000, 64, 'sha512').toString('hex');
      user = await userServiceProvider.getOne({email:body.email,password:password},{isActive:1,name:1,country:1,email:1,vatNumber:1,role:1},true);
      if(user!=null){
        if(user.isActive){
          code = 204;
          status = 'success';
          let token = userServiceProvider.generateJwt(user);
          user = _.extend({},user,{jwt:token});
          msg = serverMessages.SUCCESS_FOUND;
        }else{
          code = 204;
          msg = serverMessages.ERROR_CAN_NOT_LOGIN;
        }
      }else{
        code = 204;
        msg = serverMessages.ERROR_NO_USER;
      }
    }else{
      code = 204;
      msg = serverMessages.ERROR_FINDING_EMAIL;
    }
    res.status(200)
        .json({
          code:code,
          status: status,
          data: user,
          message: msg
        });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }
  
}
const updateUser = async(req,res)=>{
  try{
    var body = req.body;
    sharedService.resetErrors();
    let isValidRequest = true;
    
    var body = req.body;
    if(_.isEmpty(body)){
      isValidRequest = false;
      sharedService.setError('requestBody','Request body is empty');
    }
    if(!req.params.id){
      isValidRequest = false;
      sharedService.setError('id',"User's id is missing");
    }
    if(!isValidRequest){
      return res
      .json({
        code:204,
        status: 'failure',
        data: sharedService.getErrors(),
        message: serverMessages.ERROR_GET_USERDATA
      });
    }
    let userId = ObjectId(req.access_token._id);
    let user = await userServiceProvider.update({_id:userId},body);
    let code =200;
    let msg = serverMessages.SUCCESS_UPDATED;
    let status="success";
    if(user==null){
      code = 204;
      msg = serverMessages.ERROR_NO_USER;
      status="failure";
    }
    return res.status(code)
        .json({
          code:code,
          status: status,
          data: user,
          message: msg
        });
  }catch(err){
    console.log(err);
    if (err) {
      return next(Boom.badImplementation(err.message));
    }
  }

}

module.exports = {
  register: register,
  login:login,
  updateUser:updateUser
};
