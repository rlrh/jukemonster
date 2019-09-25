import { Redirect } from 'react-router';
import React from 'react';

import { useAuth } from '../state/useAuth';

const SignIn = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  const REDIRECT_URL = process.env.REACT_APP_BACKEND_URL + '/authorize/new';
  window.location.replace(REDIRECT_URL);
  return null;
};

export default SignIn;
