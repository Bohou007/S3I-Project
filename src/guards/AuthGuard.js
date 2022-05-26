/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
import LoginAdmin from '../pages/auth/LoginAdmin';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  console.log('Local storage after login admin', user);
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const role = localStorage.getItem('role');

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // if (!isAuthenticated) {
  //   if (pathname !== requestedLocation) {
  //     setRequestedLocation(pathname);
  //   } else {

  //   }
  // }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    if (role === 'admin') {
      return <LoginAdmin />;
    } else {
      return <Login />;
    }
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
