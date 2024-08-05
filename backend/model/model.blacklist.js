const mongoose=require('mongoose');
const blacklistSchema=mongoose.Schema({
    token:String
})
const blacklistedModel=mongoose.model('blackList',blacklistSchema);
module.exports=blacklistedModel;