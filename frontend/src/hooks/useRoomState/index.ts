import { useMemo, useEffect, useReducer } from 'react';
import useWebSocket from 'react-use-websocket';
import { produce } from 'immer';
import { useAuth } from '../../state/useAuth';
import useOnlineStatus from '@rehooks/online-status';
import {
  RoomState,
  Track,
  QueueEvent,
  VoteActionEvent,
  Event,
  EventType,
  Message,
  StopEvent,
} from './types';

const getStoredValue = (key: string) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue != null) {
      return JSON.parse(storedValue); // Value is an object
    }
  } catch {
    // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
    console.warn(
      'Could not access browser storage. Session will be lost when closing browser window',
    );
  }
  return null;
};

const useRoomState = (roomId: string) => {
  const { access_token } = useAuth();
  const token = useMemo(() => access_token, []);
  const onlineStatus = useOnlineStatus();

  // Setup WebSocket connection hook
  const socketUrl = process.env.REACT_APP_WEBSOCKET_URL + `/ws/room/${roomId}`;
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
  const [sendWebSocketMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS_AUTHENTICATED,
  );

  useEffect(() => {
    console.log('effect fired');
    if (onlineStatus) {
      sendCachedMessages();
      console.log('online :)');
    } else {
      console.log('offline :)');
    }
  }, [onlineStatus]);

  const ROOM_STATE_KEY = roomId + '-state';
  const ROOM_ACTIONS_KEY = roomId + '-actions';

  // TODO: remove placeholder initial values
  let initialState = getStoredValue(ROOM_STATE_KEY);
  if (initialState == null) {
    initialState = {
      nowPlayingTrack: {},
      queuedTracks: [],
      isAlive: true,
      deviceConnected: true,
    };
  }

  // Return new state based on actions receieved from WebSockets
  const reducer = (state: RoomState, action: Event) => {
    console.log('Current state: ' + JSON.stringify(state));
    console.log('Incoming action: ' + JSON.stringify(action));

    let nextState = state;
    switch (action.type) {
      case EventType.Stop:
        nextState = produce(state, draftState => {
          const status = action.payload.type;
          if (status === 'close') {
            draftState.isAlive = false;
          } else if (status === 'disconnect') {
            //draftState.deviceConnected = false;
          }
        });
      case EventType.Playback:
        nextState = produce(state, draftState => {
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
        nextState = produce(state, draftState => {
          const incomingTracks = action.payload.songs;
          if (action.payload.type == 'all') {
            draftState.queuedTracks.length = 0;
            incomingTracks.forEach(incomingTrack => {
              draftState.queuedTracks.push(incomingTrack);
            });
          } else {
            incomingTracks.forEach(incomingTrack => {
              const incomingTrackQueueIndex = draftState.queuedTracks.findIndex(
                track => track.id === incomingTrack.id,
              );
              if (incomingTrackQueueIndex === -1) {
                draftState.queuedTracks.push(incomingTrack);
              } else {
                draftState.queuedTracks[
                  incomingTrackQueueIndex
                ] = incomingTrack;
              }
            });
          }
        });
        break;
      case EventType.VoteCount:
        nextState = produce(state, draftState => {
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
        nextState = state;
    }

    localStorage.setItem(ROOM_STATE_KEY, JSON.stringify(nextState));

    return nextState;
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
        type: 'changes',
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendWebSocketMessage(JSON.stringify(message));
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
    sendMessage(message);
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
    sendMessage(message);
  }

  function sync() {
    console.log('Sync requested');
    const message: StopEvent = {
      type: EventType.Stop,
      payload: {
        type: 'reconnect',
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(message);
  }

  // Caches message if offline else sends it
  function sendMessage(message) {
    if (!onlineStatus) {
      console.log('offline saving');
      const oldcache = getStoredValue(ROOM_ACTIONS_KEY);
      if (oldcache != null) {
        oldcache.push(message);
        localStorage.setItem(ROOM_ACTIONS_KEY, JSON.stringify(oldcache));
      } else {
        localStorage.setItem(ROOM_ACTIONS_KEY, JSON.stringify([message]));
      }
    } else {
      sendWebSocketMessage(JSON.stringify(message));
    }
  }

  function sendCachedMessages() {
    localStorage.removeItem(ROOM_STATE_KEY);
    const cachedMessages = getStoredValue(ROOM_ACTIONS_KEY);
    if (cachedMessages != null) {
      cachedMessages.forEach(element => {
        sendWebSocketMessage(JSON.stringify(element));
        console.log('sending old msg');
      });
      localStorage.removeItem(ROOM_ACTIONS_KEY);
    }
  }

  return {
    nowPlayingTrack: state.nowPlayingTrack,
    queuedTracks: state.queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
    sync,
    isAlive: state.isAlive,
    deviceConnected: state.deviceConnected,
  };
};

export default useRoomState;
