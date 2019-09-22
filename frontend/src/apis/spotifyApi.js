import { useFetch } from 'react-async';

export const searchSpotify = async (query, track = 'track', getToken) => {
  if (!getToken()) {
    return { error: 'You must be logged in to search for tracks.' };
  }
  const headers = {
    Authorization: `Bearer ${credentials.spotify_access_token}`,
  };
  const data = await fetch(`https://api.spotify.com/v1/me`, { headers });
  if (data.status >= 400) {
    await refreshSpotifyToken();
  }
};
