import React from 'react';
import { useSpotifyApi } from '../../apis';
import useDeclarativeDataFetching from '../../hooks/useDeclarativeDataFetching';
import { NowPlayingWithTrackProps } from './types';
import NowPlayingWithTrackData from './NowPlayingWithTrackData';

const NowPlayingWithTrack: React.FC<NowPlayingWithTrackProps> = ({ track }) => {
  /* Legacy code
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${spotify_access_token}`,
  };
  const { data, error } = useFetch(
    `https://api.spotify.com/v1/tracks/${trackID}`,
    { headers },
  );
  */

  const trackID = track.id;
  const { getApi } = useSpotifyApi();
  const { data } = useDeclarativeDataFetching(
    getApi,
    `https://api.spotify.com/v1/tracks/${trackID}`,
  );

  if (data) {
    const imageSource = data.album.images[0].url;
    return <NowPlayingWithTrackData {...track} imageSource={imageSource} />;
  }

  return <NowPlayingWithTrackData {...track} />;
};

export default NowPlayingWithTrack;
