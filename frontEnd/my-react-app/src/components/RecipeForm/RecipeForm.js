import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    cuisine: '',
    difficulty: '',
    image: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.ingredients || !formData.instructions || !formData.cuisine || !formData.difficulty || !formData.image) {
      alert('All fields are required.');
      return;
    }

    const formDataWithArray = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(item => item.trim()),
    };

    try {
      const response = await fetch('http://localhost:3001/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithArray),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Recipe added successfully!');
        navigate('/admindashboard');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: 25 }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{color:"orange"}}>
                      RecipeForm
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-utensils me-3" style={{fontSize:"25px", color:"orange"}}/>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter Recipe Name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-list me-3" style={{fontSize:"25px", color:"orange"}}/>
                        <div className="form-outline flex-fill mb-0">
                          <textarea
                            name="ingredients"
                            className="form-control"
                            rows="4"
                            placeholder="Enter ingredients (comma separated)"
                            value={formData.ingredients}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-lightbulb me-3" style={{fontSize:"25px", color:"orange"}}/>
                        <div className="form-outline flex-fill mb-0">
                          <textarea
                            name="instructions"
                            className="form-control"
                            rows="4"
                            placeholder="Enter instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-bowl-food me-3" style={{fontSize:"25px", color:"orange"}}/>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="cuisine"
                            className="form-control"
                            placeholder="Enter cuisine name"
                            value={formData.cuisine}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-triangle-exclamation me-3" style={{fontSize:"25px", color:"orange"}} />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="difficulty"
                            className="form-control"
                            placeholder="Enter difficulty level"
                            value={formData.difficulty}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fa-solid fa-image me-3" style={{fontSize:"25px", color:"orange"}} />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="image"
                            className="form-control"
                            placeholder="Please paste image URL"
                            value={formData.image}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-lg" style={{backgroundColor:"orange"}}
                        >
                          Add Recipe
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://wallpaperaccess.com/full/767048.jpg"
                      className="img-fluid"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: '25px' }}
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
