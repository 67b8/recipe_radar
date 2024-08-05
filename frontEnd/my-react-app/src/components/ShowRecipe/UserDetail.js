import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard'; // Assuming you have a RecipeCard component
import './UserDetail.css';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    // Fetch user details
    axios.get(`http://localhost:3001/api/user/getdetails/${id}`)
      .then(response => {
        setUser(response.data);
        return response.data.favorites || []; // Assuming favorites is an array of recipe IDs
      })
      .then(favoriteIds => {
        // Fetch details of favorite recipes
        return Promise.all(favoriteIds.map(recipeId => axios.get(`http://localhost:3001/api/recipes/search/id/${recipeId}`)));
      })
      .then(recipeResponses => {
        const recipes = recipeResponses.map(res => res.data);
        setFavoriteRecipes(recipes);
      })
      .catch(error => {
        console.error('Error fetching user details or favorite recipes:', error);
      });
  }, [id]);

  return (
    <div className="container mt-4">
      {user ? (
        <div className="user-info">
          <div className="user-avatar">
            <div className="circle-avatar">
              {user.username ? user.username[0].toUpperCase() : ''}
            </div>
            <h1>{user.username}</h1>
          </div>
        </div>
      ) : (
        <p>User details not available</p>
      )}
      <hr className="my-4" />
      <div className="mt-4">
        <h2 className="text-center mb-4">All Saved Recipes</h2>
        <div className="d-flex flex-wrap justify-content-around">
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map((recipe, index) => (
              <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
                <div className="grid-item mb-3" style={{ width: "236px", height: "375px",borderRadius:'0' }}>
                  <RecipeCard
                    recipename={recipe.name}
                    image={recipe.image}
                    description={`Let's make amazing ${recipe.name}`}
                    averageRating={recipe.averageRating}
                  />
                </div>
              </Link>
            ))
          ) : (
            <p>No favorite recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
