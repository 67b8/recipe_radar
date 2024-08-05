import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const Navigate=useNavigate();
  return (
    <div className='Footer' id='footer'>
      <div className='footer-content'>
        <div className='footer-content-left'>
          <h2 style={{color:'orange'}}>RecipeRadar</h2>
          <p>Unlock the secret to great cooking with personalized recipes just for you.</p>
          <div className='footer-social-icons'>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin"></i>
          </div>
        </div>
        <div className='footer-content-center'>
          <h2>Company</h2>
          <ul>
            <li><a onClick={()=>Navigate('/')}>Home</a></li>
            <li><a href="#carouselExampleFade">About us</a></li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className='footer-content-right' id="contactus">
          <h2>Get in Touch</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>reciperadar@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">copyright 2024 @RecipeRadar.com</p>
    </div>
  );
}

export default Footer;
