const Tribe = require('./tribe.modal');

exports.create = body => {
    return new Promise((resolve, reject) => {
      Tribe.create(body, (err, user) => {
          if (err) {
              return reject(err);
          } else {
              resolve(user);
          }
        });
      });
}
exports.addMember = (conditions={},body,isLean=false) =>{
  return new Promise((resolve, reject) => {
    conditions.isDeleted = false;
    let Obj = Tribe.findOneAndUpdate(conditions,{$push:{members:body}},{new:true});
    if(isLean){
      Obj.lean();
    }
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}
exports.removeMember = (tribeId,memberId) =>{
  return new Promise((resolve, reject) => {
    let Obj = Tribe.findByIdAndUpdate(tribeId,{$pull:{"members":{_id:memberId}}},{new:true});
    
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}

exports.addPost = (conditions={},body,isLean=false) =>{
  return new Promise((resolve, reject) => {
    let Obj = Tribe.findOneAndUpdate(conditions,{$push:{posts:body}},{new:true});
    if(isLean){
      Obj.lean();
    }
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}
exports.updateTribe = (conditions={},body,isLean=false) =>{
  return new Promise((resolve, reject) => {
    let Obj = Tribe.findOneAndUpdate(conditions,{$set:body});
    if(isLean){
      Obj.lean();
    }
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}
exports.updatePost = (conditions={},body,isLean=false) =>{
  return new Promise((resolve, reject) => {
    let Obj = Tribe.findOneAndUpdate(conditions,{$set:body},{new : true});
    if(isLean){
      Obj.lean();
    }
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}
exports.updateMember = (conditions={},body,isLean=false) =>{
  return new Promise((resolve, reject) => {
    let Obj = Tribe.findOneAndUpdate(conditions,{$set:body},{new : true});//.select({"members": 1});
    if(isLean){
      Obj.lean();
    }
    Obj.exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  });
}
exports.getOne = (conditions={},projection={},isLean=false) => {
  return new Promise((resolve, reject) => {
      let userObj = Tribe.findOne(conditions,projection);
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

exports.getAll = (aggregate) => {
  return new Promise((resolve, reject) => {
    Tribe.aggregate(aggregate).exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          resolve(data);
        }
    });
  }); 
}