import React from 'react';
import { Navigate } from 'react-router-dom';
import { useauth } from '../../context/AppContext';

const Protected = ({ children }) => {
  const { user, loading } = useauth();

  if (loading) return <div>Loading...</div>;

  // if user not logged in, redirect to login
  if (!user) return <Navigate to="/" replace />;

  // if user is logged in, render the protected component
  return children;
};

export default Protected;
