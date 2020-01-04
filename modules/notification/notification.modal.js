var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    notification:{type:String,default:""},
    isNotify: {type: Boolean, default: false}, 
    isRead: {type: Boolean, default: false}, 
    isActive: {type: Boolean, default: true}, 
    isDeleted:{type: Boolean, default: false},
    createdAt:{type: Date}
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

var modelObj = mongoose.model('Notification', userSchema);
module.exports = modelObj;