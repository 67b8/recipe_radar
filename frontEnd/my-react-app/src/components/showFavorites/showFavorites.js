import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./showFavorite.css"; // Import your CSS file for ShowFavorites

export default function ShowFavorites() {
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.favorites) {
      setFavoriteRecipeIds(user.favorites);
    }
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipePromises = favoriteRecipeIds.map(id =>
          axios.get(`https://recipeserver-67b8s-projects.vercel.app/api/recipes/search/id/${id}`)
        );
        const recipeResponses = await Promise.all(recipePromises);
        const fetchedRecipes = recipeResponses.map(response => response.data);
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    if (favoriteRecipeIds.length > 0) {
      fetchRecipes();
    }
  }, [favoriteRecipeIds]);

  return (
    <div className="favorites-container mt-4">
        <h3 className="favorites-heading">YOUR FAVORITES</h3>
        <div className="recipe-grid">
          {recipes.map((recipe, index) => (
            <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
              <div className="grid">
              <RecipeCard recipename={recipe.name} description={`Let's make amazing ${recipe.name}`} averageRating={recipe.averageRating} image={recipe.image}/>
              </div>
            </Link>
          ))}
        </div>
      </div>
  );
}
