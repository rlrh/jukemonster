import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useFetch } from 'react-async';
import { useAuth } from '../../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();
  const { data, error, isLoading } = useFetch(
    process.env.REACT_APP_BACKEND_URL + `/authorize/done/${location.search}`,
  );

  useEffect(() => {
    if (data) {
      console.log('Your Spotify access token is: ' + data.access_token);
      signIn(data.access_token);
    }
  }, [data]);

  if (isLoading) return 'Loading';
  if (error) return 'Something went wrong...';
  if (data) return <Redirect to="/" />;
  return null;
};

export default SignInCallback;
