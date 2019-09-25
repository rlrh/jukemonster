import { useOurApi, useSpotifyApi } from './base';
import { Credentials } from './types';
import axios from 'axios';

export const refreshToken = async (token: Credentials) => {
  const res = await axios.post(
    process.env.REACT_APP_BACKEND_URL + '/authorize/refresh/',
    token,
  );
  return res.data as Credentials;
};

export { useOurApi, useSpotifyApi };
export type Credentials = Credentials;
