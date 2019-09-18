import { Redirect } from 'react-router';
import { useFetch } from 'react-async';
import React, { useEffect } from 'react';
import queryString from 'query-string';

import { useAuth } from '../state/useAuth';

const SignInCallback = ({ location }) => {
  const { signIn } = useAuth();
  const headers = { Accept: 'application/json' };
  const options = { credentials: 'include' };
  const { data, error, isLoading, run } = useFetch(
    `http://127.0.0.1:8000/authorize/done/${location.search}`,
    { headers },
    options,
  );
  if (data) {
    console.log('Your Spotify access token is: ' + data.access_token);
  }
  return (
    <React.Fragment>
      {isLoading && <div> 'Loading...' </div>}
      {error && <div> "Something's wrong..." </div>}
      {data && <Redirect to="/" />}
    </React.Fragment>
  );
  /*
  useEffect(() => {
    const values = queryString.parse(location.search);
    const accessToken = values.access_token;
    if (values) {
    } else {
      console.log('ERROR: could not parse Spotify access token');
    }
    signIn(accessToken);
  }, []);
*/
};
export default SignInCallback;
