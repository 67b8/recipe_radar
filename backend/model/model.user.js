const mongoose = require('mongoose');
const bcrypt=require('bcrypt');




//UserModel

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    preferences:{
        dietraryRestrictions:[String],
        favouriteCuisines:[String]
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'Recipe'}],
    usertype:Number

});
const userModel=mongoose.model('User',userSchema);

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports=userModel;