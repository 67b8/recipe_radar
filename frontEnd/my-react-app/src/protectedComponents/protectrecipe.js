import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRecipe= () => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRecipe;
