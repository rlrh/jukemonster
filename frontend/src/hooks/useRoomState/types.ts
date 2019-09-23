// Message

export interface Message {
  data: string;
}

// Room state

export interface IRoomState {
  nowPlayingTrack: ITrack | {};
  queuedTracks: ITrack[];
}

// Events

export enum EventType {
  Queue = 'queueEvent',
  Playback = 'playbackEvent',
  VoteAction = 'voteActionEvent',
  VoteCount = 'voteCountEvent',
}

export interface IQueueEvent {
  type: EventType.Queue;
  payload: IQueueEventPayload;
}

export interface IPlaybackEvent {
  type: EventType.Playback;
  payload: IPlaybackEventPayload;
}

export interface IVoteActionEvent {
  type: EventType.VoteAction;
  payload: IVoteActionEventPayload;
}

export interface IVoteCountEvent {
  type: EventType.VoteCount;
  payload: IVoteCountEventPayload;
}

export type Event =
  | IQueueEvent
  | IPlaybackEvent
  | IVoteActionEvent
  | IVoteCountEvent;

// Event payloads

export interface IQueueEventPayload {
  songs: ITrack[];
}

export interface IPlaybackEventPayload extends ITrack {}

export interface IVoteActionEventPayload {
  votes: IVote[];
}

export interface IVoteCountEventPayload {
  songs: [
    {
      id: string;
      votes: number;
    },
  ];
}

// Base interfaces

export interface ITrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  isExplicit: boolean;
  imageSource: string;
  trackDuration: number;
  votes?: number;
}

export interface IVote {
  id: string;
  voteDirection: 'up' | 'down';
}
