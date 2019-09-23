import React from 'react';
import NowPlayingWithTrack from './NowPlayingWithTrack';
import NowPlayingWithoutTrack from './NowPlayingWithoutTrack';
import { PlaybackEventPayload } from '../../hooks/useRoomState/types';

type NowPlayingContainerProps = {
  track: PlaybackEventPayload;
};

const NowPlaying: React.FC<NowPlayingContainerProps> = ({ track }) => {
  if ('id' in track) {
    return <NowPlayingWithTrack track={track} />;
  }
  return <NowPlayingWithoutTrack />;
};

export default NowPlaying;
