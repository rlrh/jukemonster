import { useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { useImmerReducer, Reducer } from 'use-immer';
import {
  IRoomState,
  ITrack,
  IQueueEvent,
  IVoteActionEvent,
  Event,
  EventType,
  Message,
} from './types';

const useRoomState = (roomId: string) => {
  // Setup WebSocket connection hook
  const socketUrl = `ws://127.0.0.1:8000/ws/room/${roomId}/`;
  const STATIC_OPTIONS = useMemo(
    () => ({
      onOpen: console.log,
      onError: console.log,
      onMessage: handleMessage,
      onClose: console.log,
    }),
    [],
  );
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS,
  );

  // TODO: remove placeholder initial values
  const initialState: IRoomState = {
    nowPlayingTrack: {},
    queuedTracks: [],
  };

  // Return new state based on actions receieved from WebSockets
  const reducer: Reducer<IRoomState, Event> = (state, action) => {
    console.log('Current state: ' + JSON.stringify(state));
    console.log('Current action: ' + JSON.stringify(action));
    switch (action.type) {
      case EventType.Playback:
        return {
          nowPlayingTrack: action.payload,
          queuedTracks: state.queuedTracks.filter(
            track => track.id !== action.payload.id,
          ),
        };
      case EventType.Queue:
        const queueEventUpdater = () => {
          const incomingTracks = action.payload.songs;
          incomingTracks.forEach(incomingTrack => {
            const incomingTrackQueueIndex = state.queuedTracks.findIndex(
              track => track.id === incomingTrack.id,
            );
            if (incomingTrackQueueIndex === -1) {
              state.queuedTracks.push(incomingTrack);
            } else {
              state.queuedTracks[incomingTrackQueueIndex] = incomingTrack;
            }
          });
        };
        return void queueEventUpdater();
      case EventType.VoteCount:
        const voteCountEventUpdater = () => {
          const incomingTracks = action.payload.songs;
          incomingTracks.forEach(incomingTrack => {
            const incomingTrackQueueIndex = state.queuedTracks.findIndex(
              track => track.id === incomingTrack.id,
            );
            if (incomingTrackQueueIndex !== -1) {
              state.queuedTracks[incomingTrackQueueIndex].votes =
                incomingTrack.votes;
            }
          });
        };
        return void voteCountEventUpdater();
      default:
        return state;
    }
  };

  // State management
  const [state, dispatch] = useImmerReducer<IRoomState, Event>(
    reducer,
    initialState,
  );

  // Let reducer handle state update
  function handleMessage(rawMessage: any) {
    const message: Message = rawMessage as Message;
    const action: Event = JSON.parse(message.data);
    dispatch(action);
  }

  // Handler for adding track
  function addTrack(track: ITrack) {
    console.log(`Added track ${track.id}`); // TODO: remove
    const message: IQueueEvent = {
      type: EventType.Queue,
      payload: {
        songs: [track],
      },
    };
    console.log(message); // TODO: remove
    sendMessage(JSON.stringify(message));
  }

  // Handler for track upvote
  function upvoteTrack(id: string) {
    console.log(`Upvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: IVoteActionEvent = {
      type: EventType.VoteAction,
      payload: {
        votes: [
          {
            id,
            voteDirection: 'up',
          },
        ],
      },
    };
    console.log(message);
    sendMessage(JSON.stringify(message));
  }

  // Handler for track downvote
  function downvoteTrack(id: string) {
    console.log(`Downvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: IVoteActionEvent = {
      type: EventType.VoteAction,
      payload: {
        votes: [
          {
            id,
            voteDirection: 'down',
          },
        ],
      },
    };
    console.log(message);
    sendMessage(JSON.stringify(message));
  }

  return {
    nowPlayingTrack: state.nowPlayingTrack,
    queuedTracks: state.queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
  };
};

export default useRoomState;
