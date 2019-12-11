const User = require('./user.modal');
const _ = require('lodash');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
exports.create = body => {
    return new Promise((resolve, reject) => {
        User.create(body, (err, user) => {
          if (err) {
              return reject(err);
          } else {
              resolve(user);
          }
        });
      });
}
exports.getOne = (conditions={},projection={},isLean=false) => {
    return new Promise((resolve, reject) => {
        let userObj = User.findOne(conditions,projection);
        if(isLean){
          userObj.lean();
        }
        userObj.exec((err, user) => {
            if (err) {
              return reject(err);
            } else {
              resolve(user);
            }
        });
      });
}
exports.update = (conditions={},set={},options={new:true}) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate(conditions,set,options)
          .exec((err, user) => {
            if (err) {
              return reject(err);
            } else {
              resolve(user);
            }
          });
      });
}

exports.getAll = (conditions={}) => {
    console.log(conditions);
    return new Promise((resolve, reject) => {
        User.find(conditions)
          .exec((err, user) => {
            if (err) {
              return reject(err);
            } else {
              resolve(user);
            }
          });
      });
};
exports.generateJwt = function (user) {
  return jwt.sign({
      _id: user._id,
      email: user.email,
      role: user.role,
  }, CONFIG.jwtSecret,{expiresIn: '24h'}); // DO NOT KEEP YOUR SECRET IN THE CODE!

};

exports.verifyToken = function (token, cb) {
  jwt.verify(token, CONFIG.jwtSecret, function (err, dcode) {
      if (err) {
          cb(false);
      }
      else {
          cb(dcode);
      }
  })
};