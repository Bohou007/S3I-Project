/* eslint-disable no-unreachable */
/* eslint-disable no-else-return */
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  console.log('Guest user', user);
  if (isAuthenticated) {
    if (user.role !== 'customer') {
      return <Navigate to={PATH_DASHBOARD_ADMIN.root} />;
    } else {
      return <Navigate to={PATH_DASHBOARD.root} />;
    }
  }

  return <>{children}</>;
}
