import React from 'react';
import NowPlayingWithTrack from './NowPlayingWithTrack';
import NowPlayingWithoutTrack from './NowPlayingWithoutTrack';
import { NowPlayingContainerProps } from './types';

const NowPlaying: React.FC<NowPlayingContainerProps> = ({ track }) => {
  if ('id' in track) {
    return <NowPlayingWithTrack track={track} />;
  }
  return <NowPlayingWithoutTrack />;
};

export default NowPlaying;
