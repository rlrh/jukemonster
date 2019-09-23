import { useOurApi, useSpotifyApi } from './base';
import { Credentials } from './types';

export const refreshToken = async (token: Credentials) => {
  const res = await fetch('http://127.0.0.1:8000/authorize/refresh/', {
    method: 'POST',
    body: JSON.stringify(token),
  });
  return await res.json();
};

export { useOurApi, useSpotifyApi };
export { Credentials };
