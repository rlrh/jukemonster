import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();
  const headers = { Accept: 'application/json' };
  const options = { credentials: 'include' };
  const { data, error, isLoading } = useFetch(
    `http://127.0.0.1:8000/authorize/done/${location.search}`,
    { headers },
    options,
  );

  useEffect(() => {
    if (data) {
      console.log('Your Spotify access token is: ' + data.access_token);
      signIn(data.access_token);
    }
  }, [data]);

  return (
    <React.Fragment>
      {isLoading && <div> 'Loading...' </div>}
      {error && <div> "Something's wrong..." </div>}
      {data && <Redirect to="/" />}
    </React.Fragment>
  );
};
export default SignInCallback;
