import { Redirect } from 'react-router';
import { useFetch } from 'react-async';
import React, { useEffect } from 'react';
import queryString from 'query-string';

import { useAuth } from '../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();

  const { data, error, isLoading } = useFetch(
    `http://127.0.0.1:8000/authorize/done/${location.search}`,
  );
  if (isLoading) return 'Loading...';
  /*
  useEffect(() => {
    const values = queryString.parse(location.search);
    const accessToken = values.access_token;
    if (values) {
      console.log('Your Spotify access token is: ' + accessToken);
    } else {
      console.log('ERROR: could not parse Spotify access token');
    }
    signIn(accessToken);
  }, []);
*/

  if (error) {
    console.log(error);
    return "Something's wrong...";
  }
  if (data) {
    console.log(data);
    return <Redirect to="/" />;
  }
};
export default SignInCallback;
