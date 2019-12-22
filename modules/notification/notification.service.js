const Model = require('./notification.modal');
const _ = require('lodash');

exports.create = body => {
    return new Promise((resolve, reject) => {
      Model.create(body, (err, notification) => {
          if (err) {
              return reject(err);
          } else {
              resolve(notification);
          }
        });
      });
}
exports.getOne = (conditions={},projection={},isLean=false) => {
    return new Promise((resolve, reject) => {
        let notificationObj = Model.findOne(conditions,projection);
        if(isLean){
          notificationObj.lean();
        }
        notificationObj.exec((err, notification) => {
            if (err) {
              return reject(err);
            } else {
              resolve(notification);
            }
        });
      });
}
exports.update = (conditions={},set={},options={new:true}) => {
    return new Promise((resolve, reject) => {
      Model.findOneAndUpdate(conditions,set,options)
          .exec((err, notification) => {
            if (err) {
              return reject(err);
            } else {
              resolve(notification);
            }
          });
      });
}


exports.getAll = (aggregate) => {
  return new Promise((resolve, reject) => {
    Model.aggregate(aggregate).exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  }); 
};
