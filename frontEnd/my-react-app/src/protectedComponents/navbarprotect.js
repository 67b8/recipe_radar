import React from 'react';
import { useAuth } from '../context/authentication';
import Usernavbar from '../components/usernavbar';
import Adminnavbar from '../components/adminnavbar';

function AppNavbar() {
  const auth = useAuth();
  
  if (auth.user === 1) {
    return <Adminnavbar />;
  } else if (auth.user === 0) {
    return <Usernavbar />;
  } else {
    return null;
  }
}

export default AppNavbar;
