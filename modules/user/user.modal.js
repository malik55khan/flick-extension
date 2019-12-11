var mongoose = require('mongoose');
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({

    name: {type: String},
    email: {type: String, unique: true, required: 'Please enter the email'},
    password: {type: String, select: false},
    salt:{type: String},
    country: {type: String},
    vatNumber: {type: String},
    role:{type:String,enum:["admin","customer",'member'],default:"member"},
    profileImage: {type: String},
    isActive: {type: Boolean, default: false}, // enable/disable user login
    isDeleted:{type: Boolean, default: false},
    isAdmin:{type: Boolean, default: false}
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
userSchema.plugin(uniqueValidator);
userSchema.plugin(uniqueValidator, {message: "Email already exists"});
userSchema.pre('save', function (next) {
    var user = this;
    // generate a random salt for every user for security
    user.salt = crypto.randomBytes(16).toString('hex');
    //user.emailVerificationToken = crypto.randomBytes(16).toString('hex');
    user.password = crypto.pbkdf2Sync(user.password, this.salt, 1000, 64, 'sha512').toString('hex');
    next();
});

userSchema.index({ email: 1}, { unique: true });
var modelObj = mongoose.model('User', userSchema);
module.exports = modelObj;