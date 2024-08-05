const recipeModel=require('../model/model.recipe');
const express=require('express')
const userModel=require('../model/model.user')
//adding new Recipe
async function addRecipe(req,res){
    try {
        const recipe = await recipeModel.create({
            name:req.body.name,
            ingredients:req.body.ingredients,
            instructions: req.body.instructions,
            cuisine:req.body.cuisine,
            difficulty:req.body.difficulty,                  
            image: req.body.image,
        });
        res.status(201).json({ message: "recipe created successfully", recipe });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getRecipes(req,res){
    
    try{
    const recipes=await recipeModel.find();
    if(!recipes){
        res.status(404).send("recipes does not exist!");
    }
    else{
        res.status(200).json(recipes);
    }
    }
    catch(error){
        console.log("error in searching:",error);
        res.status(404).json({message:"Internal server error"})
    }
}
//getting recipe by id
async function getRecipeById(req,res){
    const {id}=req.params;
    try{
    const recipes=await recipeModel.findById(id);
    if(!recipes){
        res.status(404).send("recipe with this id does not exist!");
    }
    else{
        res.status(200).json(recipes);
    }
    }
    catch(error){
        console.log("error in searching recipe by id:",error);
        res.status(404).json({message:"Internal server error"})
    }
}


//getting recipe by ingredient
async function getRecipeByIngredient(req,res){
    const {ingredient}=req.params;
    try{
        // const recipes=await recipeModel.find(ingredients,{'$regex':ingredient,'$options':'i'})
        const recipes = await recipeModel.find(
            { ingredients: { $regex: ingredient, $options: 'i' } }
        );
        if(!recipes){
            res.status(404).send("recipes with this ingredient does not exist");
           
        }
        else{
            console.log(recipes)
            res.status(200).json(recipes);
        }
    }
    catch(error){
        console.log("error in searching recipe")
        res.status(404).json({message:"Internal server error"})
    }
}



//getting recipe by cuisine
async function getRecipeByCuisine(req,res){
    const {cuisine}=req.params;
    try{
        // const recipes=await recipeModel.find(ingredients,{'$regex':ingredient,'$options':'i'})
        const recipes = await recipeModel.find(
            { cuisine: { $regex: cuisine, $options: 'i' } }
        );
        if(!recipes){
            res.status(404).send("recipes with this cuisine does not exist"); 
        }
        else{
            console.log(recipes)
            res.status(200).json(recipes);
        }
    }
    catch(error){
        console.log("error in searching recipe")
        res.status(404).json({message:"Internal server error"})
    }
}
//get recipe by difficulty
async function getRecipeByDifficulty(req, res) {
    const { difficulty } = req.params;
    try {
        const recipes = await recipeModel.find(
            { difficulty: { $regex: difficulty, $options: 'i' } }
        );
        if (!recipes || recipes.length === 0) {
            res.status(404).send("recipes with this difficulty level do not exist");
        } else {
            console.log(recipes);
            res.status(200).json(recipes);
        }
    } catch (error) {
        console.log("error in searching recipe");
        res.status(500).json({ message: "Internal server error" });
    }
}

//getting recipe by name
async function getRecipeByName(req,res){
    const {name}=req.params;
    try{
       
        const recipes = await recipeModel.find(
            { name: { $regex: name, $options: 'i' } }
        );
        if(!recipes){
            res.status(404).send("recipes with this name does not exist");
        }
        else{
            console.log(recipes)
            res.status(200).json(recipes);
        }
    }
    catch(error){
        console.log("error in searching recipe")
        res.status(404).json({message:"Internal server error"})
    }
}

//getRecipeByUserPreference
async function getRecipeByUserPreference(req, res) {
    const user=await userModel.findById(req.params.id);
    const cu=user.preferences.favouriteCuisines;
    try{
        recipes=[]
        for(const cuisine of cu){
        const r = await recipeModel.find(
            { cuisine: { $regex: cuisine, $options: 'i' } }
        );
        recipes=recipes.concat(r)
    }
    console.log(recipes)
        if(recipes.length==0){
            res.status(404).send("recipes with this cuisine does not exist");
        }
        else{
            console.log(recipes)
            res.status(200).json(recipes);
        }
    }
    catch(error){
        console.log("error in searching recipe")
        res.status(404).json({message:"Internal server error"})
    }

}



module.exports={addRecipe,getRecipeById,getRecipeByIngredient,getRecipeByCuisine,getRecipeByName,getRecipeByUserPreference,getRecipes,getRecipeByDifficulty}



