import { Redirect } from 'react-router';
import React, { useEffect } from 'react';
import queryString from 'query-string';

import { useAuth } from '../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();

  useEffect(() => {
    console.log('Raw query parameters: ' + location.search);
    const values = queryString.parse(location.search);
    const accessToken = values.access_token;
    if (values) {
      console.log('Your Spotify access token is: ' + accessToken);
    } else {
      console.log('ERROR: could not parse Spotify access token');
    }
    signIn(accessToken);
  }, []);

  return <Redirect to="/" />;
};
export default SignInCallback;
