import { PlaybackEventPayload, Track } from '../../hooks/useRoomState/types';

export type NowPlayingContainerProps = {
  track: PlaybackEventPayload;
};

export type NowPlayingWithTrackProps = {
  track: Track;
};

export type NowPlayingWithTrackDataProps = {
  name: string;
  artists: string;
  album: string;
  isExplicit: boolean;
  imageSource: string;
};
