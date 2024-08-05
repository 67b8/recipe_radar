import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import React, { useState } from 'react';
import { useAuth } from '../../context/authentication';
import ProfileNavBar from '../ProfileNavbar/ProfileNavBar';
import UserPreferences from '../UserPreferences/UserPreferences';
import ShowFavorites from '../showFavorites/showFavorites';
import ShowLiked from '../showLiked/showLiked';
import './ProfilePage.css';

const ProfilePage = () => {
  const auth = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);
  const [view, setView] = useState(''); // 'preferences', 'favourites', or 'liked'

  const handlePreferencesClick = (type) => {
    setView(type);
    setShowPreferences(type === 'preferences');
  };

  // Retrieve username from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user ? user.username : '';

  return (
    <div className="home-container">
      <div className="content">
        <div className="image-container">
          <img src={'https://tse2.mm.bing.net/th?id=OIP.yYUwl3GDU07Q5J5ttyW9fQHaHa&pid=Api&P=0&h=180'} alt="Profile" className="home-logo" />
          <div className="icon-overlay">
            <CameraAltOutlinedIcon fontSize="large" />
          </div>
        </div>
        <div className="text-container mt-1">
          <h1>{username}</h1>
        </div>
        <button className='circular-button mb-3 mt-1' onClick={auth.logOut}>Log Out</button>
        <ProfileNavBar onPreferencesClick={handlePreferencesClick} />
        <div className="view-container">
          {view === 'preferences' && showPreferences && <UserPreferences />}
          {view === 'favourites' && <ShowFavorites />}
          {view === 'liked' && <ShowLiked />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
