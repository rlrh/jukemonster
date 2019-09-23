import { Track } from '../../hooks/useRoomState/types';

export type Track = Track;

export type QueueProps = {
  tracks: Track[];
  onTrackUpvote: (id: string) => void;
  onTrackDownvote: (id: string) => void;
};

export type QueueTrackProps = Partial<Track> & {
  onUpvote: () => void;
  onDownvote: () => void;
};
