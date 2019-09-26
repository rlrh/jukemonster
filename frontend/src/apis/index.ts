import { useOurApi, useSpotifyApi } from './base';
import { Credentials } from './types';
import axios from 'axios';

export const refreshToken = async (token: Credentials) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/authorize/refresh/',
      token,
    );
    return res.data as Credentials;
  } catch (error) {
    console.log('Failed to connect to server!');
    throw error;
  }
};

export { useOurApi, useSpotifyApi };
export type Credentials = Credentials;
