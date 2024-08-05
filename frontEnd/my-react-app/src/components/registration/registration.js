import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registration.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      dietaryRestrictions: [],
      favouriteCuisines: [],
    },
    usertype: false,
  });
  const [error, setError] = useState('');

  const dietaryRestrictionsOptions = [
    "Vegan", "Non-Vegetarian", "Pescetarian", "Gluten-Free", "Dairy-Free", "Nut-Free", "Diabetes"
  ];

  const favouriteCuisinesOptions = [
    "Italian", "American", "Asian", "Chinese", "Japanese", "Indian", "Mexican", "South Western"
  ];

  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      let updatedPreferences = [...prevState.preferences[category]];
      if (checked && !updatedPreferences.includes(name)) {
        updatedPreferences.push(name);
      } else if (!checked && updatedPreferences.includes(name)) {
        updatedPreferences = updatedPreferences.filter(item => item !== name);
      }
      return {
        ...prevState,
        preferences: {
          ...prevState.preferences,
          [category]: updatedPreferences,
        },
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      if (type === 'checkbox') {
        return {
          ...prevState,
          [name]: checked,
        };
      }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, preferences, usertype } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Name, Email, Password, and Confirm Password are required fields.');
      alert('Name, Email, Password, and Confirm Password are required fields.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          preferences: {
            dietaryRestrictions: preferences.dietaryRestrictions,
            favouriteCuisines: preferences.favouriteCuisines,
          },
          usertype: usertype ? 1 : 0,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate('/login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
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
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: '#FFA900' }}>
                      Sign up
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="username" style={{ color: '#FFA900' }}>
                            Your Name <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="email" style={{ color: '#FFA900' }}>
                            Your Email <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="password" style={{ color: '#FFA900' }}>
                            Password <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="confirmPassword" style={{ color: '#FFA900' }}>
                            Confirm Password <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-utensils fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="dietaryRestrictions" style={{ color: '#FFA900' }}>
                            Dietary Restrictions
                          </label>
                          <div>
                            {dietaryRestrictionsOptions.map((option) => (
                              <div key={option}>
                                <input
                                  type="checkbox"
                                  name={option}
                                  checked={formData.preferences.dietaryRestrictions.includes(option)}
                                  onChange={(e) => handleCheckboxChange(e, 'dietaryRestrictions')}
                                />
                                <label>{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-globe fa-lg me-3 fa-fw" style={{ color: '#FFA500' }} />
                        <div className="form-outlines flex-fill mb-0">
                          <label htmlFor="favouriteCuisines" style={{ color: '#FFA900' }}>
                            Favourite Cuisines
                          </label>
                          <div>
                            {favouriteCuisinesOptions.map((option) => (
                              <div key={option}>
                                <input
                                  type="checkbox"
                                  name={option}
                                  checked={formData.preferences.favouriteCuisines.includes(option)}
                                  onChange={(e) => handleCheckboxChange(e, 'favouriteCuisines')}
                                />
                                <label>{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input custom-checkbox"
                          type="checkbox"
                          name="usertype"
                          id="form2Example3c"
                          checked={formData.usertype}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="form2Example3c">
                          Register as Admin
                        </label>
                      </div>
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                      <div className="form-check d-flex justify-content-center mb-5">
                        <p>
                          Already have an account? <Link to="/login">Login</Link>
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-lg"
                          style={{ backgroundColor: '#FFA900', color: '#FFF' }}
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/06/23/0/FNK_Goulash-H_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1592939451186.jpeg"
                      className="img-fluid"
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
