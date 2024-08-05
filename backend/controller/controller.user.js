const { model } = require('mongoose');
const userModel=require('../model/model.user');
const recipeModel=require('../model/model.recipe')
const bcrypt = require('bcrypt');
const BlacklistToken=require('../model/model.blacklist')
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');



//signupform
async function signUpForm(req, res) {
    try {
        if (
            req.body.username === undefined ||
            req.body.email === undefined ||
            req.body.password === undefined ||
            req.body.preferences === undefined ||
            req.body.preferences.dietaryRestrictions === undefined ||
            req.body.preferences.favouriteCuisines === undefined
        ) { 
            return res.status(400).json({message:"Enter all details properly"});
        }
        const usersCheckEmail=await userModel.find({email:{$regex:req.body.email,$options:'i'}});
        if(usersCheckEmail.length>0)
            return res.status(400).json({message:"this email is already registered "});
        const usersCheckName=await userModel.find({username:{$regex:req.body.username,$options:'i'}})
        if(usersCheckName.length>0)
            return res.status(400).json({message:"Another user already exists with this name. Please try a different name"})
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await userModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            preferences: {
                dietraryRestrictions:req.body.preferences.dietaryRestrictions,
            favouriteCuisines:req.body.preferences.favouriteCuisines
        },
            favorites: [],
            likes:[],
            usertype:req.body.usertype
        });
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}




//login form
async function loginForm(req, res) { 
   
    try {
        const users = await userModel.find({ email: { '$regex': req.body.email, '$options': 'i' } });
        console.log(users)
        if (users.length === 0) {
            res.status(404).json({ message: "email does not exist!" });
        } else {
            const user = users[0];
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(401).json({ message: "Invalid login credentials! Please check it." });
            else{
                let payload = { email:user.email};
                const token = jwt.sign(payload, "Secret Key",{expiresIn:"1h"});
                res.status(200).json({token:token,user:user});
            } 
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



//logout
// async function logout(req, res) {
//     const token = req.headers.authorization.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: "Token is missing" });
//     }
//     try {
//         const decoded = jwt.verify(token, "Secret Key");
//         if (!decoded) {
//             console.log(token);
//             return res.status(401).json({ message: "Token is invalid" });
//         }
//         const blacklistedToken = await BlacklistToken.create({ token });
//         if (blacklistedToken) {
//             return res.status(200).json({ message: "User successfully logged out" });
//         } else {
//             return res.status(500).json({ message: "Failed to blacklist token" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }



//get preferences
async function getPreference(req,res){
    const {id}=req.params;
    try{
    const users=await userModel.findById(id);
    console.log(users)
    if (users.length === 0) {
        res.status(404).json({ message: "User does not exist!" });
    } else {
        res.status(200).send(users.preferences)
    }
    }
    catch(error){
        console.error("Error getting preference:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//updating user preferences
async function updatePreference(req, res) {
    try {
        const { id } = req.params;
        const { preferences } = req.body; 
        const updatedUser = await userModel.findByIdAndUpdate(id,req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const upUser=await userModel.findById(id);
        res.status(200).json({userpreferences:upUser.preferences})
    } catch (error) {
        console.error("Error updating preference:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



//likes a recipe
async function likeRecipe(req,res){
    const recipeId=req.body.recipeId;
    const user=await userModel.findById(req.params.id);
    let likes=user.likes||[];
    if(likes.length>0 && likes.includes(recipeId)){
        const recipeIndex=likes.indexOf(recipeId)
        likes.splice(recipeIndex,1);
        user.likes=likes;
        await user.save()
        const recipe=await recipeModel.findById(recipeId);
        recipe.likes--;
        await recipe.save();
        res.status(200).json({isLiked:false});
    }
    else{
    likes.push(recipeId);
    const user1=await userModel.findByIdAndUpdate(req.params.id,{likes:likes});
    const recipe=await recipeModel.findById(recipeId);
    let noOfLikes=recipe.likes;
    noOfLikes++;
    const recipe1=await recipeModel.findByIdAndUpdate(recipeId,{likes:noOfLikes});
    res.status(200).json({isLiked:true});
    }
}


//add recipe to favourites 
async function addFavouriteRecipe(req,res){
    const recipeId=req.body.recipeId;
    const user=await userModel.findById(req.params.id);
    let favorites=user.favorites||[];
    if(favorites.length>0 && favorites.includes(recipeId)){
        const recipeIndex=favorites.indexOf(recipeId)
        favorites.splice(recipeIndex,1);
        user.favorites=favorites;
        await user.save()
        return res.status(200).json({isFavorited:false})
    }
    favorites.push(recipeId);
    const user1=await userModel.findByIdAndUpdate(req.params.id,{favorites:favorites});
    return res.status(200).json({isFavorited:true});
}

//add comment
async function addComment(req, res) {
    const { id } = req.params; 
    const { recipeId, comment } = req.body; 

    try {
        const userId = req.body.userId;
        const comment = req.body.comment;
        let newComment = {
            user: userId, 
            comment: comment,
            timestamp: Date.now()
        };
        const recipe = await recipeModel.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        let comments = recipe.comments || []; 
        comments.push(newComment);
        const updatedRecipe = await recipeModel.findByIdAndUpdate(
             id,
            { comments: comments },
            { new: true } 
        );
        res.status(200).json({ message: "Comment added successfully", recipe: updatedRecipe });
    } catch (error) {
        console.log("Error in adding comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//remove comment
async function removeComment(req, res) {
    try {
        const { id } = req.params;
        const { recipeId } = req.body;
        const recipe = await recipeModel.findById(recipeId);
        const commentIndex = recipe.comments.findIndex(comment => comment.user === id);
        recipe.comments.splice(commentIndex, 1);
        await recipe.save();
        res.status(200).json({ message: "Comment removed successfully!" });
    } catch (error) {
        console.error("Error removing comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



//Rate a recipe
async function rateRecipe(req,res){
    try{
    const rate=req.body.rate;
    const recipeId=req.body.recipeId;
    console.log(recipeId)
    const recipe=await recipeModel.findById(recipeId);
    const rateArray=recipe.Rating||[];
    let sum=0;
    if(rateArray.length>0)
        sum=rateArray.reduce((var1,var2)=>var1+var2);
    sum=sum+rate;
    rateArray.push(rate)
    const averageRating = parseFloat((sum / rateArray.length).toFixed(1));
    console.log("averagerating:",averageRating)
    console.log("rating:",rateArray);
    const recipe1 = await recipeModel.findByIdAndUpdate(recipeId, { averageRating: averageRating, Rating: rateArray }, { new: true });
    res.status(200).json({message:"user rated recipe successfully"})
}
catch(error){
    console.log("error in rating a recipe",error);
    res.status(404).json({message:"Internal server error"})
}
}


const getuserdetails = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userModel.findById(userId).lean(); // Using lean() for better performance as it returns plain JavaScript objects
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { getuserdetails };
  


module.exports={signUpForm,loginForm,getPreference,updatePreference,likeRecipe,addFavouriteRecipe,addComment,rateRecipe,removeComment,getuserdetails};


