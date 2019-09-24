import { useOurApi, useSpotifyApi } from './base';
import { Credentials } from './types';
import axios from 'axios';

export const refreshToken = async (token: Credentials) => {
  const res = await axios.post(
    'http://127.0.0.1:8000/authorize/refresh/',
    token,
  );
  return res.data as Credentials;
};

export { useOurApi, useSpotifyApi };
export type Credentials = Credentials;
