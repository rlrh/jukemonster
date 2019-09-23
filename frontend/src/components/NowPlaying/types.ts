import { PlaybackEventPayload, Track } from '../../hooks/useRoomState/types';

export type NowPlayingContainerProps = {
  track: PlaybackEventPayload;
};

export type NowPlayingWithTrackProps = {
  track: Track;
};
