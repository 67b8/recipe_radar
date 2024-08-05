import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppDownload from '../AppDownload/AppDownload';
import Carousel from '../Carousel/carousel';
import Footer from '../Footer/Footer';
import RecipeCard from '../RecipeCard/RecipeCard';
import AdminNavbar from '../adminnavbar/adminnavbar';
import axios from 'axios';
export default function Admindashboard() {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.preferences.favouriteCuisines) {
      fetchRecommendedRecipes(user.preferences.favouriteCuisines);
    }
  }, []);

  const fetchRecommendedRecipes = (cuisines) => {
    const fetchRecipes = async () => {
      try {
        const recipePromises = cuisines.map(cuisine=>
          axios.get(`http://localhost:3001/api/recipes/search/cuisine/${cuisine}`)
        );
        const recipeResponses = await Promise.all(recipePromises);
        const fetchedRecipes = recipeResponses.flatMap(response => response.data);
        console.log(fetchedRecipes);
        setRecommendedRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/recipes')
      .then(response => response.json())
      .then(data => setAllRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <>
    <AdminNavbar></AdminNavbar>
      <Carousel />
      {recommendedRecipes.length>0 &&
      <div className="container mt-4 userdashboard" id="userdashboard">
      <h2 className="text-center mb-4">BASED ON YOUR PREFERENCES WE RECOMMEND YOU</h2>
      <div className="d-flex flex-wrap justify-content-around">
        {recommendedRecipes.map((recipe, index) => (
          <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
            <div className="grid-item mb-3" style={{ width: "236px", height: "375px",borderRadius:'0' }}>
              <RecipeCard recipename={recipe.name} description={`Let's make amazing ${recipe.name}`} averageRating={recipe.averageRating} image={recipe.image}/>
            </div>
          </Link>
        ))}
      </div>
    </div>}
      <div className="container mt-4 userdashboard" id="userdashboard">
        <h2 className="text-center mb-4">ALL RECIPES</h2>
        <div className="d-flex flex-wrap justify-content-around">
          {allRecipes.map((recipe, index) => (
            <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
              <div className="grid-item mb-3" style={{ width: "236px", height: "375px",borderRadius:'0' }}>
                <RecipeCard recipename={recipe.name} description={`Let's make amazing ${recipe.name}`} averageRating={recipe.averageRating} image={recipe.image}/>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <AppDownload />
      <Footer />
    </>
  );
}
