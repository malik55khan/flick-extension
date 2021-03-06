var mongoose = require('mongoose');
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({

    name: {type: String},
    email: {type: String,  required: 'Please enter the email'},
    nickname: {type: String},
    password: {type: String, select: false},
    salt:{type: String},
    phoneNumber:{type:String},
    country: {type: String},
    vatNumber: {type: String},
    role:{type:String,enum:["customer",'member'],default:"customer"},
    subscriptionType:{type:String,enum:["free",'paid'],default:"free"},
    picture: {type: String},
    isActive: {type: Boolean, default: true}, // enable/disable user login
    isDeleted:{type: Boolean, default: false},
    isAdmin:{type: Boolean, default: false},
    startNow:{type: Boolean, default: true},
    disclaimerNotRead:{type: Boolean, default: true}
});
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    user.salt = crypto.randomBytes(16).toString('hex');
    user.password = crypto.pbkdf2Sync(user.password, this.salt, 1000, 64, 'sha512').toString('hex');
    next();
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


var modelObj = mongoose.model('user-profiles', userSchema);
module.exports = modelObj;