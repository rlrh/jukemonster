import { useMemo, useReducer } from 'react';
import useWebSocket from 'react-use-websocket';
import { produce } from 'immer';
import { useAuth } from '../../state/useAuth';
import {
  RoomState,
  Track,
  QueueEvent,
  VoteActionEvent,
  Event,
  EventType,
  Message,
} from './types';

const useRoomState = (roomId: string) => {
  const { isAuthenticated, access_token } = useAuth();
  const token = useMemo(() => access_token, []);

  // Setup WebSocket connection hook
  const socketUrl = process.env.REACT_APP_WEBSOCKET_URL + '/ws/room/${roomId}';
  const STATIC_OPTIONS_AUTHENTICATED = useMemo(
    () => ({
      onOpen: console.log,
      onError: console.log,
      onMessage: handleMessage,
      onClose: console.log,
      queryParams: { access_token: token },
    }),
    [],
  );
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS_AUTHENTICATED,
  );

  // TODO: remove placeholder initial values
  const initialState: RoomState = {
    nowPlayingTrack: {},
    queuedTracks: [],
  };

  // Return new state based on actions receieved from WebSockets
  const reducer = (state: RoomState, action: Event) => {
    console.log('Current state: ' + JSON.stringify(state));
    console.log('Incoming action: ' + JSON.stringify(action));

    switch (action.type) {
      case EventType.Playback:
        return produce(state, draftState => {
          const incomingTrack = action.payload;
          draftState.nowPlayingTrack = incomingTrack;
          if ('id' in incomingTrack) {
            draftState.queuedTracks = draftState.queuedTracks.filter(
              track => track.id !== incomingTrack.id,
            );
          }
        });
      case EventType.Queue:
        return produce(state, draftState => {
          const incomingTracks = action.payload.songs;
          incomingTracks.forEach(incomingTrack => {
            const incomingTrackQueueIndex = draftState.queuedTracks.findIndex(
              track => track.id === incomingTrack.id,
            );
            if (incomingTrackQueueIndex === -1) {
              draftState.queuedTracks.push(incomingTrack);
            } else {
              draftState.queuedTracks[incomingTrackQueueIndex] = incomingTrack;
            }
          });
        });
      case EventType.VoteCount:
        return produce(state, draftState => {
          const incomingTracks = action.payload.songs;
          incomingTracks.forEach(incomingTrack => {
            const incomingTrackQueueIndex = draftState.queuedTracks.findIndex(
              track => track.id === incomingTrack.id,
            );
            if (incomingTrackQueueIndex !== -1) {
              draftState.queuedTracks[incomingTrackQueueIndex].votes =
                incomingTrack.votes;
            }
          });
        });
      default:
        return state;
    }
  };

  // State management
  const [state, dispatch] = useReducer(reducer, initialState);

  // Let reducer handle state update
  function handleMessage(rawMessage: any) {
    const message: Message = rawMessage as Message;
    const action: Event = JSON.parse(message.data);
    dispatch(action);
  }

  // Handler for adding track
  function addTrack(track: Track) {
    console.log(`Added track ${track.id}`); // TODO: remove
    const message: QueueEvent = {
      type: EventType.Queue,
      payload: {
        songs: [track],
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(JSON.stringify(message));
  }

  // Handler for track upvote
  function upvoteTrack(id: string) {
    console.log(`Upvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: VoteActionEvent = {
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
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(JSON.stringify(message));
  }

  // Handler for track downvote
  function downvoteTrack(id: string) {
    console.log(`Downvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: VoteActionEvent = {
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
    console.log('Outgoing action: ' + JSON.stringify(message));
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
