// Message

export type Message = {
  data: string;
};

// Room state

export type RoomState = {
  nowPlayingTrack: Track | {};
  queuedTracks: Track[];
  isAlive: boolean;
  deviceConnected: boolean;
};

// Events

export enum EventType {
  Queue = 'queueEvent',
  Playback = 'playbackEvent',
  VoteAction = 'voteActionEvent',
  VoteCount = 'voteCountEvent',
  Stop = 'stopEvent',
  Invalidate = 'invalidateEvent',
}

export type QueueEvent = {
  type: EventType.Queue;
  payload: QueueEventPayload;
};

export type PlaybackEvent = {
  type: EventType.Playback;
  payload: PlaybackEventPayload;
};

export type VoteActionEvent = {
  type: EventType.VoteAction;
  payload: VoteActionEventPayload;
};

export type VoteCountEvent = {
  type: EventType.VoteCount;
  payload: VoteCountEventPayload;
};

export type StopEvent = {
  type: EventType.Stop;
  payload: StopEventPayload;
};

export type InvalidateEvent = {
  type: EventType.Invalidate;
};

export type Event =
  | QueueEvent
  | PlaybackEvent
  | VoteActionEvent
  | VoteCountEvent
  | StopEvent
  | InvalidateEvent;

// Event payloads

export type QueueEventPayload = {
  songs: Track[];
  type: string;
};

export type StopEventPayload = {
  type: string;
};

export type PlaybackEventPayload = Track | {};

export type VoteActionEventPayload = {
  votes: Vote[];
};

export type VoteCountEventPayload = {
  songs: [
    {
      id: string;
      votes: number;
    },
  ];
};

// Base types

export type Track = {
  id: string;
  name: string;
  artists: string[];
  album: string;
  isExplicit: boolean;
  imageSource: string;
  trackDuration: number;
  votes?: number;
  voteDirection?: 'up' | 'down' | 'neutral';
};

export type Vote = {
  id: string;
  voteDirection: 'up' | 'down' | 'neutral';
};
