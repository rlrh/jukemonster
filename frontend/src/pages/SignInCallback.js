import { Redirect } from 'react-router';
import React, { useEffect } from 'react';

import { useAuth } from '../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();

  useEffect(() => {
    console.log(location.search);
    const searchParams = new URLSearchParams();
    const accessToken = searchParams.get('access_token');
    console.log(`Your Spotify access token is: ${accessToken}`);
    signIn(accessToken);
  }, []);

  return <Redirect to="/" />;
};
export default SignInCallback;
