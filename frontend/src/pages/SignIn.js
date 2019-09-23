import { Redirect } from 'react-router';
import React from 'react';

import { useAuth } from '../state/useAuth';

const SignIn = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  const REDIRECT_URL = 'http://127.0.0.1:8000/authorize/new';
  window.location.replace(REDIRECT_URL);
  return null;
};

export default SignIn;
