import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';

// ----------------------------------------------------------------------
import useAuth from '../hooks/useAuth';

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

const useCurrentRole = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  return isAuthenticated && isInitialized ? user.role : null;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
