const express=require('express')
const routes=express.Router();
const jwt = require('jsonwebtoken');
module.exports=routes;

routes.use(express.json())
const getControllerUser=require('../controller/controller.user')
const getControllerRecipe=require('../controller/controller.recipe');

//Authentication end points
routes.post('/api/auth/signup',getControllerUser.signUpForm);
routes.post('/api/auth/login',getControllerUser.loginForm);
// routes.post('/api/auth/logout',getControllerUser.logout);




//User Preferences Endpoints
routes.get('/api/preferences/:id',getControllerUser.getPreference);
routes.patch('/api/preferences/:id',getControllerUser.updatePreference);



//Recipe Endpoints
routes.post('/api/recipes',getControllerRecipe.addRecipe);
routes.get('/api/recipes',getControllerRecipe.getRecipes)
routes.get('/api/recipes/search/id/:id',getControllerRecipe.getRecipeById)
routes.get('/api/recipes/search/name/:name',getControllerRecipe.getRecipeByName)
routes.get('/api/recipes/search/ingredient/:ingredient',getControllerRecipe.getRecipeByIngredient)
routes.get('/api/recipes/search/cuisine/:cuisine',getControllerRecipe.getRecipeByCuisine)
routes.get('/api/recipes/search/difficulty/:difficulty',getControllerRecipe.getRecipeByDifficulty)
routes.get('/api/recipes/userpreferences/:id',getControllerRecipe.getRecipeByUserPreference)



//user interaction endpoints
routes.post('/api/recipes/:id/like',getControllerUser.likeRecipe)
routes.post('/api/recipes/:id/favorite',getControllerUser.addFavouriteRecipe)
routes.post('/api/recipes/:id/addcomment',getControllerUser.addComment)
routes.post('/api/recipes/:id/removecomment',getControllerUser.removeComment)
routes.post('/api/recipes/:id/rate',getControllerUser.rateRecipe)


//userdetails
routes.get('/api/user/getdetails/:id',getControllerUser.getuserdetails);