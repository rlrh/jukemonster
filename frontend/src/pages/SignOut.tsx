import { Redirect } from 'react-router';
import React, { useEffect } from 'react';

import { useAuth } from '../state/useAuth';

const SignOut = () => {
  const { signOut } = useAuth();

  useEffect(() => signOut(), []);

  return <Redirect to="/" />;
};
export default SignOut;
