import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";

export default function ShowLiked() {
  const [recipes, setRecipes] = useState([]);
  const [LikedRecipeIds, setLikedRecipeIds] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.likes) {
      setLikedRecipeIds(user.likes);
    }
  }, []);

  useEffect(() => {
    if (LikedRecipeIds.length > 0) {
      const fetchRecipes = async () => {
        try {
          const recipePromises = LikedRecipeIds.map(id =>
            axios.get(`http://localhost:3001/api/recipes/search/id/${id}`)
          );
          const recipeResponses = await Promise.all(recipePromises);
          const fetchedRecipes = recipeResponses.map(response => response.data);
          setRecipes(fetchedRecipes);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      };
      fetchRecipes();
    }
  }, [LikedRecipeIds]);

  return (
    <div className="container mt-4 userdashboard" id="userdashboard">
     
      <div className="favorites-container">
        <div className="favorites-heading">
          <h2 className="text-center mb-4">YOU LIKED</h2>
        </div>
        <div className="d-flex flex-wrap justify-content-around">
          {recipes.map((recipe, index) => (
            <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
              <div className="grid-item mb-3" style={{ width: "236px", height: "375px" ,borderRadius:'0'}}>
              <RecipeCard recipename={recipe.name} description={`Let's make amazing ${recipe.name}`} averageRating={recipe.averageRating} image={recipe.image}/>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}