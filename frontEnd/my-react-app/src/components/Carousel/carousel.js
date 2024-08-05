import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

export default function Carousel({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${searchCriteria}/${searchTerm}`);
  };

  return (
    <div className="carousel-container">
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption">
            <form className="d-flex" onSubmit={handleSearch}>
            <select
                className="form-select me-2"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                style={{width:'100px'}}
              >
                <option value="name">Name</option>
                <option value="ingredient">ingredient</option>
                <option value="cuisine">cuisine</option>
                <option value="difficulty">difficulty</option>
              </select>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-success text-white bg-success" type="submit">
                Search
              </button>
            </form>
          </div>
          <div className="carousel-item active">
            <img
              src="https://www.archanaskitchen.com/images/archanaskitchen/1-Author/priyanjali/shutterstock_111998606.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-text">
              <div className="main-text">Discover New Recipes</div>
              <div className="sub-text">Explore a variety of dishes from around the world.</div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://img.freepik.com/free-photo/top-view-delicious-mayyonaise-salad-with-greens-vegetables-dark-space_140725-75694.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-text">
              <div className="main-text">Welcome to RecipeRadar!</div>
              <div className="sub-text">We are dedicated to bring you the best recipes from all over the world</div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-text">
              <div className="main-text">Join Our Community</div>
              <div className="sub-text">Share and discover new recipes, tips, and culinary adventures.</div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
