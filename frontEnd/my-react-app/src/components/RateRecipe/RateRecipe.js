import axios from 'axios';
import React, { useState } from 'react';
import './RateRecipe.css'; 
import Rating from 'react-rating';
function RateRecipe({ recipeId, userId }) {
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleSubmit = () => {
    axios.post(`http://localhost:3001/api/recipes/${recipeId}/rate`, {
      rate: rating,
      recipeId: recipeId,
    })
    .then(response => {
      
      console.log('Rating submitted:', response.data);
      setRatingSubmitted(true); 
      alert('you rated '+rating+' stars' )
      window.location.reload(); 
    })
    .catch(error => {
      // Handle error response
      console.error('Error submitting rating:', error);
    });
  };

  if (ratingSubmitted) {
    return null; 
  }

  return (
    <div className="rate-recipe">
      <h3>Rate this Recipe</h3>
      <Rating
        initialRating={rating}
        onChange={(value) => setRating(value)}
        emptySymbol={<i className="far fa-star"></i>}
        fullSymbol={<i className="fas fa-star"></i>}
        fractions={2}
      />
      <div>{rating} Stars</div>
      <button onClick={handleSubmit} className="btn" style={{ backgroundColor: 'orange' }}>
        Submit Rating
      </button>
    </div>
  );
}

export default RateRecipe;
