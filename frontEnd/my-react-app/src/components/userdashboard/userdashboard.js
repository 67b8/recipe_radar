import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import AppDownload from '../AppDownload/AppDownload';
import Carousel from '../Carousel/carousel';
import Footer from '../Footer/Footer';
import RecipeCard from '../RecipeCard/RecipeCard';
import axios from 'axios';
import Usernavbar from '../usernavbar/usernavbar';
export default function Userdashboard() {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.preferences.favouriteCuisines) {
      fetchRecommendedRecipes(user.preferences.favouriteCuisines, user.preferences.dietraryRestrictions);
    }
  }, []);

  const fetchRecommendedRecipes = async (cuisines, dietaryRestrictions) => {
    try {
      const recipePromises = cuisines.map(cuisine =>
        axios.get(`https://recipeserver-67b8s-projects.vercel.app/api/recipes/search/cuisine/${cuisine}`)
      );
      const recipeResponses = await Promise.all(recipePromises);
      let fetchedRecipes = recipeResponses.flatMap(response => response.data);

      
      fetchedRecipes = fetchedRecipes.filter(recipe => {
        for (const restriction of dietaryRestrictions) {
          if (recipe.type===restriction) {
            return false; 
          }
        }
        return true; 
      });

      console.log(fetchedRecipes)
      setRecommendedRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching or filtering recipes:', error);
    }
  };

  useEffect(() => {
    fetch('https://recipeserver-67b8s-projects.vercel.app/api/recipes')
      .then(response => response.json())
      .then(data => setAllRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <>
    <Usernavbar/>
      <Carousel />
      {recommendedRecipes.length>0 &&
      <div className="container mt-4 userdashboard" id="userdashboard">
      <h2 className="text-center mb-4" style={{color:'darkcyan'}}>BASED ON YOUR PREFERENCES WE RECOMMEND YOU</h2>
      <div className="d-flex flex-wrap justify-content-around">
        {recommendedRecipes.map((recipe, index) => (
            // <Link key={index} className="nav-link" to={`/recipe/${recipe._id}`}>
            <div key={index} className="grid-item mb-3" style={{ width: "236px", height: "375px",borderRadius:'0' }} onClick={()=>navigate( `/recipe/${recipe._id}`) }>
              <RecipeCard recipename={recipe.name} description={`Let's make amazing ${recipe.name}`} averageRating={recipe.averageRating} image={recipe.image}/>
            </div>
          // </Link>
        ))}
      </div>
    </div>}
      <div className="container mt-4 userdashboard" id="userdashboard">
        <h2 className="text-center mb-4" style={{color:'darkcyan'}}>ALL RECIPES</h2>
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

