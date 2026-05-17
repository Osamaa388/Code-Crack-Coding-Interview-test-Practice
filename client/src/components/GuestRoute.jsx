import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getStoredToken, isTokenExpired } from '../utils/token.js';

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const token = getStoredToken();

  if (loading) return null;
  if (token && !isTokenExpired(token) && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
