import React, { useState, useEffect } from "react";
import axios from "axios";
import './UserPreference.css';

function UserPreferences() {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showDietOptions, setShowDietOptions] = useState(false);
  const [showCuisineOptions, setShowCuisineOptions] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  const recipes1 = [
    { name: "Italian", picture: "https://x.yummlystatic.com/web/bubble/cuisine/italian.png" },
    { name: "American", picture: "https://x.yummlystatic.com/web/bubble/cuisine/american.png" },
    { name: "Asian", picture: "https://x.yummlystatic.com/web/bubble/cuisine/asian.png" },
    { name: "Chinese", picture: "https://x.yummlystatic.com/web/bubble/cuisine/chinese.png" },
    { name: "Japanese", picture: "https://x.yummlystatic.com/web/bubble/cuisine/japanese.png" },
    { name: "Indian", picture: "https://x.yummlystatic.com/web/bubble/cuisine/indian.png" },
    { name: "Mexican", picture: "https://x.yummlystatic.com/web/bubble/cuisine/mexican.png" },
    { name: "South Western", picture: "https://x.yummlystatic.com/web/bubble/cuisine/southwestern.png" }
  ];

  const preferences1 = [
    { name: "Vegan", picture: "https://www.cureveda.com/cdn/shop/files/Logo_New_1_e207fc7c-b49b-45aa-a1c8-3bd2b106865d.png?v=1707588211&width=352" },
    { name: "Non-Vegetarian", picture: "https://media.istockphoto.com/id/1742997187/vector/whole-roasted-chicken-on-plate-grilled-chicken-in-plate-non-veg-food-non-vegetarian-dish.jpg?s=612x612&w=0&k=20&c=3ioolOYDg528vaa0He_BCUKIY7tPB7enUlT_mIlYxEc=" },
    { name: "Pescetarian", picture: "https://cdn.iconscout.com/icon/premium/png-256-thumb/pescatarian-5434092-4535857.png"},
    { name: "Gluten-Free", picture: "https://i.pinimg.com/originals/f3/fa/4b/f3fa4bae27c7c632e5ed07aca5209694.png" },
    { name: "Dairy-Free", picture: "https://banner2.cleanpng.com/20180812/wqv/kisspng-brand-product-design-logo-t-shirt-font-dairy-free-icon-related-keywords-amp-suggestions-5b6ffacc25b333.0249816015340653561544.jpg" },
    { name: "Nut-Free", picture: "https://www.shutterstock.com/image-vector/nut-free-icon-vector-illustration-260nw-720088726.jpg" },
    { name: "Diabetes", picture: "https://www.shutterstock.com/image-vector/vector-circle-icon-emblem-linear-600nw-2026752749.jpg" }
  ];

  useEffect(() => {
    // Fetch initial preferences from the backend
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id; 
    axios.get(`http://localhost:3001/api/preferences/${userId}`)
      .then(response => {
        console.log("Fetched user preferences:", response.data); // Log the response to see its structure

        const dietaryRestrictions = response.data.dietraryRestrictions || [];
        const favoriteCuisines = response.data.favouriteCuisines || [];

        const fetchedDiets = preferences1.filter(item => dietaryRestrictions.includes(item.name));
        const fetchedCuisines = recipes1.filter(item => favoriteCuisines.includes(item.name));

        setSelectedDiets(fetchedDiets);
        setSelectedCuisines(fetchedCuisines);
        setDietaryPreferences(preferences1.filter(item => !dietaryRestrictions.includes(item.name)));
        setRecipes(recipes1.filter(item => !favoriteCuisines.includes(item.name)));
      }).catch(error => {
        console.error("Error fetching user preferences:", error);
      });

    setDietaryPreferences(preferences1);
    setRecipes(recipes1);
  }, []);

  async function handleSelect(index, type) {
    if (type === 'diet') {
      const selected = dietaryPreferences[index];
      setSelectedDiets(prevSelectedDiets => {
        const updatedDiets = [...prevSelectedDiets, selected];
        updatePreferences(updatedDiets, selectedCuisines);
        return updatedDiets;
      });
      setDietaryPreferences(prevDietaryPreferences => prevDietaryPreferences.filter((_, i) => i !== index));
    } else if (type === 'cuisine') {
      const selected = recipes[index];
      setSelectedCuisines(prevSelectedCuisines => {
        const updatedCuisines = [...prevSelectedCuisines, selected];
        updatePreferences(selectedDiets, updatedCuisines);
        return updatedCuisines;
      });
      setRecipes(prevRecipes => prevRecipes.filter((_, i) => i !== index));
    }
  }

  function handleRemove(index, type) {
    if (type === 'diet') {
      const removed = selectedDiets[index];
      setSelectedDiets(prevSelectedDiets => {
        const updatedDiets = prevSelectedDiets.filter((_, i) => i !== index);
        updatePreferences(updatedDiets, selectedCuisines);
        return updatedDiets;
      });
      setDietaryPreferences(prevDietaryPreferences => [...prevDietaryPreferences, removed]);
    } else if (type === 'cuisine') {
      const removed = selectedCuisines[index];
      setSelectedCuisines(prevSelectedCuisines => {
        const updatedCuisines = prevSelectedCuisines.filter((_, i) => i !== index);
        updatePreferences(selectedDiets, updatedCuisines);
        return updatedCuisines;
      });
      setRecipes(prevRecipes => [...prevRecipes, removed]);
    }
  }

  function updatePreferences(updatedDiets, updatedCuisines) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user._id; 
      axios.patch(`http://localhost:3001/api/preferences/${userId}`, {
        preferences: {
          dietraryRestrictions: updatedDiets.map(selected => selected.name),
          favouriteCuisines: updatedCuisines.map(selected => selected.name)
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Preferences updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating preferences:', error);
      });
    } else {
      alert("Please login to update preferences");
    }
  }

  return (
    <div className="preferences-container">
     {selectedDiets.length>0 && <h4>your restrictions</h4>}
      <div className="selected-items">
        {selectedDiets && selectedDiets.map((diet, index) => (
          <div key={index} className="selected-item-content">
            <div className="selected-item">
              <img className="selected-image" src={diet.picture} alt={diet.name} />
              <i className="fa fa-trash-alt delete-icon" onClick={() => handleRemove(index, 'diet')}></i>
              <div className="overlay"></div>
              <div className="preference-name">{diet.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="place">
        <img className="image" src="https://img.freepik.com/premium-vector/diagonal-cross-line-grid-square-seamless-pattern_80590-13921.jpg" />
        <div className="plus">
          <i className="fa fa-plus" aria-hidden="true" onClick={() => setShowDietOptions(!showDietOptions)}></i>
          <div className="text1" onClick={() => setShowDietOptions(!showDietOptions)}>Add Diet</div>
        </div>
      </div>
      {showDietOptions && (
        <div className="image-grid">
          {dietaryPreferences && dietaryPreferences.map((preference, index) => (
            <div
              key={preference.name}
              className="grid-item diet"
              onClick={() => handleSelect(index, 'diet')}
            >
              <img
                className="preference-image"
                src={preference.picture}
                alt={preference.name}
              />
              <div className="overlay"></div>
              <div className="preference-name">{preference.name}</div>
            </div>
          ))}
        </div>
      )}
     <hr style={{ border: 0,height: '1px',background: '#333',backgroundImage: 'linear-gradient(to right, #ccc, #333, #ccc)',  margin: '20px 0'}} />
     {selectedCuisines.length>0 && <h4>your favouriteCuisines</h4>}
      
      <div className="selected-items">
        {selectedCuisines && selectedCuisines.map((cuisine, index) => (
          <div key={index} className="selected-item-content">
            <div className="selected-item">
              <img className="selected-image" src={cuisine.picture} alt={cuisine.name} />
              <i className="fa fa-trash-alt remove-icon" onClick={() => handleRemove(index, 'cuisine')}></i>
            
              <div className="overlay"></div>
              <div className="recipe-name">
                {cuisine.name}
              </div>
            </div>
            </div>
        ))}
      </div>
      <div className="place">
        <img className="image" src="https://img.freepik.com/premium-vector/diagonal-cross-line-grid-square-seamless-pattern_80590-13921.jpg" alt="white bg" />
        <div className="plus">
          <i className="fa fa-plus" aria-hidden="true" onClick={() => setShowCuisineOptions(!showCuisineOptions)}></i>
          <div className="text1" onClick={() => setShowCuisineOptions(!showCuisineOptions)}>Add Cuisine</div>
        </div>
      </div>
      {showCuisineOptions && (
        <div className="image-grid">
          {recipes && recipes.map((recipe, index) => (
            <div key={recipe.name} className="grid-item cuisine" onClick={() => handleSelect(index, 'cuisine')}>
              <img className="recipe-image" src={recipe.picture} alt={recipe.name}/>
              <div className="overlay"></div>
              <div className="recipe-name">
                {recipe.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPreferences; 