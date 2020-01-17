var mongoose = require('mongoose');
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({

    customerId : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tribeName : {type: String,required:"Tribe name is required"},
    tribeDescription : {type: String},
    tribeCreated : {type: Date},
    tribeActive : {type:Boolean,default:true},
    isDeleted : {type:Boolean,default:false},
    members : [
      {
        userId :  {type: mongoose.Schema.Types.ObjectId},
        userEmailAddress : {type:String},
        userPhoneNumber : {type:String},
        canPost: {type:Boolean},
        status : {type:String,enum:["invited","accepted"]},
        invitedOn : {type: Date},
        joinedOn : {type: Date}
      }
    ],
    posts : [
      {
        socialNetwork : {type:String},
        postName : {type:String},
        postUrl : {type:String},
        boostType : {type:String},
        boostCampaignStarts : {type:Date},
        boostCampaignEnds : {type:Date},
        boostSummary : {
          totalMembers : {type:Number},
          pendingMembers : {type:Number},
        },
        boostActivity : [
          {
            userId :  {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
            pending : {type:Boolean},
            date:{type:Date}
          }
        ]
      }
    ]
    
});

var Tribe = mongoose.model('tribes', userSchema);
module.exports = Tribe;