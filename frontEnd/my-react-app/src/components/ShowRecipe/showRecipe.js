import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RateRecipe from '../RateRecipe/RateRecipe';
import RatingShow from '../RatingShow/RatingShow';
import './showRecipe.css';

function ShowRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userDetailsMap, setUserDetailsMap] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/api/recipes/search/id/${id}`)
      .then(response => {
        setRecipe(response.data);
        setAverageRating(response.data.averageRating)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          if (user.likes && user.likes.includes(id)) setIsLiked(true);
          if (user.favorites && user.favorites.includes(id)) setIsFavorited(true);
        }
      })
      .catch(error => console.error('Error fetching recipe:', error));

}, [id]);

  const handleReadMoreClick = (event) => {
    event.preventDefault();
    const commentsSection = document.getElementById('comments-section');
    commentsSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`http://localhost:3001/api/recipes/${id}/addcomment`, {
        userId: JSON.parse(localStorage.getItem('user'))._id,
        comment: comment,
      })
        .then(() => {
          setComment('');
          axios.get(`http://localhost:3001/api/recipes/search/id/${id}`)
            .then(response => setRecipe(response.data));
        })
        .catch(error => console.error('Error adding comment:', error));
    } else {
      alert('Please login to add comments');
    }
  };

  const onLikeClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user._id;
      axios.post(`http://localhost:3001/api/recipes/${userId}/like`, {
        recipeId: id,
      })
        .then(response => {
          setIsLiked(response.data.isLiked);
          if (response.data.isLiked) {
            let likes = user.likes || [];
            likes.push(id);
            user.likes = likes;
          } else {
            let likes = user.likes || [];
            likes = likes.filter(likeId => likeId !== id);
            user.likes = likes;
          }
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch(error => console.error('Error liking recipe:', error));
    } else {
      alert('Please login to like the recipe');
    }
  };

  const onFavoriteClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user._id;
      axios.post(`http://localhost:3001/api/recipes/${userId}/favorite`, {
        recipeId: id,
      })
        .then(response => {
          setIsFavorited(response.data.isFavorited);
          if (response.data.isFavorited) {
            let favorites = user.favorites || [];
            favorites.push(id);
            user.favorites = favorites;
          } else {
            let favorites = user.favorites || [];
            favorites = favorites.filter(favId => favId !== id);
            user.favorites = favorites;
          }
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch(error => console.error('Error favoriting recipe:', error));
    } else {
      alert('Please login to favorite the recipe');
    }
  };

  useEffect(() => {
    if (recipe && recipe.comments) {
      recipe.comments.forEach(comment => {
        if (comment && comment.user && !userDetailsMap[comment.user]) {
          axios.get(`http://localhost:3001/api/user/getdetails/${comment.user}`)
            .then(response => {
              setUserDetailsMap(prevMap => ({
                ...prevMap,
                [comment.user]: response.data.username
              }));
              
            })
            .catch(error => {
              console.error('Error fetching user details:', error);
            });
        }
      });
    }
  }, [recipe, userDetailsMap]);


  return (
    <div style={{ width: '100vw' }} className="d-flex justify-content-center align-items-center">
      <div style={{ borderRadius: 5, marginBottom: 20 }}>
        <div style={{ width: 1132, height: 400, borderRadius: 5, display: 'flex', padding: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ margin: 10 }}>
              {recipe && recipe.name && <h1 style={{color:'orange'}}>{recipe.name}</h1>}
            </div>
            <div style={{ margin: 10, fontSize: 20 }}>
              <p style={{color:'orange'}}>
                Average Rating:
                {averageRating > 0 ? (
                  <RatingShow rating={averageRating} />
                ) : (
                  ' No ratings yet'
                )}
              </p>
            </div>
            <div style={{ margin: 10 }}>
              {recipe && recipe.comments && recipe.comments.length > 0 && (
                <p>
                 
                  {recipe.comments.length > 1 && <a href="#" className="ms-2" onClick={handleReadMoreClick} style={{color:'orange'}}>Read Comments</a>}
                </p>
              )}
            </div>
            <div style={{ margin: 10, display: 'inline-block', fontSize: 20}}>
              {recipe && recipe.cuisine && <p style={{color:'orange'}}>cuisine:{recipe.cuisine}</p>}
              {recipe && recipe.difficulty && <p style={{color:'orange'}}>difficulty:{recipe.difficulty}</p>}
             
            </div>
            <div style={{ margin: 10, display: 'flex', alignItems: 'center' }}>
              <div className="me-3" onClick={onLikeClick}>
                <i className={`fa-solid fa-thumbs-up`} style={{ color: isLiked ? 'yellowgreen' : 'gray', fontSize: 50 }} />
              </div>
              <div onClick={onFavoriteClick}>
                <i className={`fa-solid fa-star`} style={{ color: isFavorited ? 'orange' : 'gray', fontSize: 50 }} />
              </div>
            </div>
          </div>
          <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2" style={{ flex: 1 }}>
            {recipe && recipe.image && <img
              style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 10 }}
              src={recipe.image}
              className="img-fluid"
              alt="Sample image"
            />}
          </div>
        </div>
        <div>
          <hr style={{ height: 1, border: 0, backgroundColor: 'gray', margin: '100px' }} />
          <div style={{ margin: 10 }}>
            <h3 style={{ color: 'orange' }}>
              <i className="fa-solid fa-list" style={{ marginRight: '5px', color: 'orange', fontSize: '25px' }} />
              Ingredients
            </h3>
            <ul style={{ listStyleType: 'none' }}>
              {recipe && recipe.ingredients && recipe.ingredients.length > 0 && recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ fontFamily: 'Dancing Script', cursive: true, fontOpticalSizing: 'auto', fontWeight: 400, fontStyle: 'normal', fontSize: '25px' }}>
                  <i className="fas fa-check" style={{ marginRight: '50px', color: 'green' }} />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ width: '1132px', margin: '0 auto' }}>
            <hr style={{ height: 1, border: 0, backgroundColor: 'gray', margin: '100px' }} />
            <h3 style={{ margin: '20px', color: 'orange' }}>
              <i className="fas fa-lightbulb" />
              Follow these instructions...
            </h3>
            {recipe && recipe.instructions && <p style={{ margin: '20px', fontFamily: 'Dancing Script', cursive: true, fontOpticalSizing: 'auto', fontWeight: 400, fontStyle: 'normal', fontSize: '25px' }}>
              {recipe.instructions}
            </p>}
          </div>
          <div id="comments-section">
            <hr style={{ height: 1, border: 0, backgroundColor: 'gray', margin: '100px' }} />
            <div style={{ margin: 10 }}>
              <h3 style={{ color: 'orange' }}>
                <i className="fas fa-comment-alt" style={{ marginRight: '5px', color: 'orange', fontSize: '25px' }} />
                Comments
              </h3>
              {recipe && recipe.comments && recipe.comments.length > 0 ? (
                recipe.comments.map((comment, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '18px', marginBottom: '5px' }}>{comment.comment}</p>
                    <p style={{ fontSize: '14px', color: 'gray', marginBottom: '5px' }}>Posted by:  {userDetailsMap[comment.user] || comment.user}</p>
                    <hr style={{ height: 1, border: 0, backgroundColor: 'lightgray' }} />
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <div style={{ margin: 10 }}>
              <form onSubmit={handleSubmit}>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={handleCommentChange}
                  required
                />
                <button type="submit" className="btn btn-primary mt-3" style={{backgroundColor:'orange'}}>
                  Add Comment
                </button>
              </form>
            </div>
          </div>
          <div style={{ margin: '100px' }}>
            <hr style={{ height: 1, border: 0, backgroundColor: 'gray', margin: '100px' }} />
            <h3 style={{ margin: '20px', color: 'orange' }}>
              <i className="fas fa-star" />
              Rate this Recipe
            </h3>
            <RateRecipe recipeId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowRecipe;
