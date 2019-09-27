import { useLocation } from 'react-router';
import { useAuth } from '../state';

export const useSignInRedirect = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return {
    signInRedirect: () =>
      !isAuthenticated &&
      window.location.replace(
        `${process.env.REACT_APP_BACKEND_URL}/authorize/new/?redirect_to=${location.pathname}`,
      ),
  };
};
