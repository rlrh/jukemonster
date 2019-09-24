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
  const socketUrl = `ws://127.0.0.1:8000/ws/room/${roomId}`;
  const STATIC_OPTIONS_AUTHENTICATED = useMemo(
    () => ({
      onOpen: handleOpen,
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

  const getStoredValue = () => {
    try {
      const storedValue = localStorage.getItem(roomId);
      if (storedValue != null) {
        return JSON.parse(storedValue) as RoomState; // Value is an object
      }
    } catch {
      // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
      console.warn(
        'Could not access browser storage. Session will be lost when closing browser window',
      );
    }
    return null;
  };

  // TODO: remove placeholder initial values
  let initialState = getStoredValue();
  if (initialState == null) {
    initialState = {
      nowPlayingTrack: {},
      queuedTracks: [],
    };
  }

  // Return new state based on actions receieved from WebSockets
  const reducer = (state: RoomState, action: Event) => {
    console.log('Current state: ' + JSON.stringify(state));
    console.log('Incoming action: ' + JSON.stringify(action));

    let temp;

    switch (action.type) {
      case EventType.Playback:
        temp = produce(state, draftState => {
          const incomingTrack = action.payload;
          draftState.nowPlayingTrack = incomingTrack;
          if ('id' in incomingTrack) {
            draftState.queuedTracks = draftState.queuedTracks.filter(
              track => track.id !== incomingTrack.id,
            );
          }
        });
        break;
      case EventType.Queue:
        temp = produce(state, draftState => {
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
        break;
      case EventType.VoteCount:
        temp = produce(state, draftState => {
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
        break;
      default:
        temp = state;
    }

    localStorage.setItem(roomId, JSON.stringify(temp));

    return temp;
  };

  // State management
  const [state, dispatch] = useReducer(reducer, initialState);

  // Let reducer handle state update
  function handleMessage(rawMessage: any) {
    const message: Message = rawMessage as Message;
    const action: Event = JSON.parse(message.data);
    dispatch(action);
  }

  function handleOpen(event) {
    console.log('handling: ', event);
    localStorage.removeItem(roomId);
    console.log(localStorage.getItem(roomId));
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
