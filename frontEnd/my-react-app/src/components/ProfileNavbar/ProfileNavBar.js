import React from 'react';
import './ProfileNavBar.css';

const ProfileNavBar = ({ onPreferencesClick }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item" onClick={() => onPreferencesClick('preferences')}>Preferences</li>
        <li className="navbar-item" onClick={() => onPreferencesClick('favourites')}>Favourites</li>
        <li className="navbar-item" onClick={() => onPreferencesClick('liked')}>Liked</li>
      </ul>
    </nav>
  );
};

export default ProfileNavBar;
